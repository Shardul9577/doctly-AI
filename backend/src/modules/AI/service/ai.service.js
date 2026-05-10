import fs from 'fs';
import { openRouterClient } from '../../../config/openrouter.config.js';
import Visit from '../../../models/visit.model.js';
import Report from '../../../models/reports.model.js';

class AIService {
  async generateConsultationResponse({ messages }) {
    const response = await openRouterClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful medical AI assistant. Provide clear, concise, and accurate answers to medical questions. Keep responses short and simple (2-3 sentences maximum). Focus on general health information and always remind users to consult with healthcare professionals for medical advice. Do not provide diagnoses or treatment plans.',
        },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return (
      response.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a response.'
    );
  }

  async generateComprehensiveReport({ visitId, audioFile, text, userId }) {
    try {
      // Get visit data with patient information
      const visit = await Visit.findById(visitId).populate({
        path: 'doctor_patient_relations_id',
        populate: {
          path: 'patient_id',
          select: 'name email',
        },
      });

      if (!visit) {
        throw new Error('Visit not found');
      }

      const patientId = visit.doctor_patient_relations_id.patient_id._id;

      console.log(audioFile, 'audioFile');

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      // Process audio file if provided
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////

      let transcribedText = '';
      if (audioFile) {
        try {
          console.log('Starting audio transcription for file:', audioFile.path);
          const audioFileStream = fs.createReadStream(audioFile.path);

          const transcription =
            await openRouterClient.audio.transcriptions.create({
              file: audioFileStream,
              model: 'whisper-1', // Updated to use whisper-1 which is the standard OpenAI transcription model
              language: 'en',
              response_format: 'text',
            });

          console.log(
            'Audio transcription completed, type:',
            typeof transcription
          );

          // Extract transcription text (handle both string and object responses)
          let transcriptionText = '';
          if (typeof transcription === 'string') {
            transcriptionText = transcription;
          } else if (transcription && transcription.text) {
            transcriptionText = transcription.text;
          } else {
            transcriptionText = String(transcription);
          }

          console.log('Transcription length:', transcriptionText.length);

          // If transcription is longer than 300 words, summarize it to preserve context
          const words = transcriptionText.split(' ');
          if (words.length > 300) {
            const summaryResponse =
              await openRouterClient.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'user',
                    content: `Please summarize the following medical consultation transcription in exactly 300 words or less, preserving all important medical information, symptoms, and context:

                    ${transcriptionText}

                    Provide a concise summary that maintains the essential medical details and context.`,
                  },
                ],
                max_tokens: 400,
                temperature: 0.3,
              });
            transcribedText = summaryResponse.choices[0].message.content;
          } else {
            transcribedText = transcriptionText;
          }

          // Clean up the uploaded file after transcription
          try {
            fs.unlinkSync(audioFile.path);
            console.log('Temporary audio file deleted:', audioFile.path);
          } catch (unlinkError) {
            console.error(
              'Failed to delete temporary audio file:',
              unlinkError
            );
          }
        } catch (audioError) {
          console.error('Audio transcription error:', {
            message: audioError.message,
            stack: audioError.stack,
            details: audioError.error || audioError,
          });
          // Don't silently fail - log the error but continue with empty transcription
          transcribedText = '';

          // Clean up the uploaded file even if transcription failed
          try {
            if (audioFile && audioFile.path && fs.existsSync(audioFile.path)) {
              fs.unlinkSync(audioFile.path);
              console.log(
                'Temporary audio file deleted after error:',
                audioFile.path
              );
            }
          } catch (unlinkError) {
            console.error(
              'Failed to delete temporary audio file:',
              unlinkError
            );
          }
        }
      }

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      // Get visit images for analysis
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      const visitImages = visit.attachments || [];
      let imageAnalysis = '';
      let extractedVitals = [];

      if (visitImages.length > 0) {
        // Analyze each image using GPT-4o
        for (let i = 0; i < visitImages.length; i++) {
          const imageUrl = visitImages[i];

          const response = await openRouterClient.chat.completions.create({
            model: 'gpt-4o-2024-05-13',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `You are a medical image analysis AI. Analyze this medical image carefully and extract vital signs and medical information.

CRITICAL: You MUST respond with ONLY a valid JSON object (no markdown, no code blocks). Use this exact format:
{
  "analysis": "Detailed analysis of what you see in the image",
  "vitals": [
    {
      "vital_sign": "Temperature/B/P/Heart Rate/SpO2/etc",
      "reading": "the actual measurement visible in the image",
      "normal_range": "the normal range for this vital sign",
      "status": "Normal/High/Low/Not Measured"
    }
  ]
}

If you see any vital signs or measurements in the image, extract them into the vitals array. If you don't see any specific vitals, analyze the image and provide any medical observations in the "analysis" field. Return ONLY the JSON object, nothing else.`,
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageUrl,
                    },
                  },
                ],
              },
            ],
            max_tokens: 2000,
            temperature: 0.3,
          });

          const analysisText = response.choices[0].message.content;
          let analysis;
          try {
            // Try to extract JSON from the response
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              analysis = JSON.parse(jsonMatch[0]);
            } else {
              analysis = JSON.parse(analysisText);
            }

            // Extract vitals if available
            if (analysis.vitals && Array.isArray(analysis.vitals)) {
              extractedVitals.push(...analysis.vitals);
            }

            // Add analysis text (either from 'analysis' field or full response)
            if (analysis.analysis) {
              imageAnalysis += `Image ${i + 1}: ${analysis.analysis}\n\n`;
            } else {
              imageAnalysis += `Image ${i + 1}: ${analysisText}\n\n`;
            }
          } catch (parseError) {
            // Store the raw analysis for the final report
            imageAnalysis += `Image ${i + 1}: ${analysisText}\n\n`;
          }
        }
      }

      // Get previous reports of the patient
      const previousReports = await Report.find({
        visit: {
          $in: await Visit.find({
            'doctor_patient_relations_id.patient_id': patientId,
          }).select('_id'),
        },
      }).select('diagnosis vitals ai_health_analysis');

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      // Generate final report using GPT 4o Mini
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      const combinedInput = `
Visit Information:
- Visit Date: ${visit.visit_date}
- Visit Time: ${visit.visit_time}
- Duration: ${visit.duration} minutes
- Visit Type: ${visit.visit_type}
- Symptoms: ${visit.symptoms?.join(', ') || 'Not specified'}
- Current Diagnosis: ${visit.diagnosis?.join(', ') || 'Not specified'}

Audio Transcription:
${transcribedText || 'No audio transcription available'}

Image Analysis:
${imageAnalysis || 'No image analysis available'}

Previous Reports:
${previousReports.length > 0 ? previousReports.map((report) => `Diagnosis: ${report.diagnosis}\nVitals: ${JSON.stringify(report.vitals)}\nSummary: ${report.ai_health_analysis?.current_health_summary?.join(', ')}`).join('\n\n') : 'No previous reports available'}
      `;

      const reportResponse = await openRouterClient.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'system',
            content:
              'You are a medical AI assistant. You MUST respond with ONLY valid JSON. Do NOT include markdown code blocks, explanations, or any text outside the JSON object. Return ONLY the JSON object.',
          },
          {
            role: 'user',
            content: `Based on the following medical visit information, generate a comprehensive medical report. Use ALL available data to provide meaningful insights:

${combinedInput}

IMPORTANT: Even if some data is missing (like audio transcription or images), use the available visit information, symptoms, and previous reports to generate meaningful medical insights.

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no explanations). Use this exact structure:

{
  "diagnosis": "A specific and detailed diagnosis based on ALL available information",
  "vitals": [
    {
      "vital_sign": "Temperature/B/Pulse/etc",
      "reading": "actual measurement",
      "normal_range": "normal range for this vital",
      "status": "Normal/High/Low"
    }
  ],
  "healthSummary": [
    "Point 1: Specific observation from the visit data",
    "Point 2: Specific recommendation based on symptoms",
    "Point 3: Specific action item based on findings",
    "Point 4: Specific follow-up recommendation",
    "Point 5: Overall assessment and next steps"
  ],
  "diseases": [
    {
      "disease": "Specific disease name",
      "probability": 0.0-1.0,
      "risk_level": "Low/Medium/High",
      "reason": "Detailed explanation of why this diagnosis"
    }
  ]
}

CRITICAL REQUIREMENTS:
- The diagnosis MUST be specific and detailed, NOT generic phrases like "Assessment based on available data"
- Generate at least 3-5 vitals based on symptoms, images, or standard monitoring
- healthSummary MUST be an array of 5 CLEAN strings (no JSON syntax, no quotes, no colons - just plain text sentences)
- Each string in healthSummary should be a complete, actionable sentence WITHOUT any JSON syntax
- Only include diseases with probability >= 0.3
- Extract vitals from images if available
- If no vitals detected, suggest monitoring key vitals based on symptoms
- Be medically accurate and specific
- Return ONLY the JSON object, nothing else`,
          },
        ],
        max_tokens: 4000,
        temperature: 0.3,
      });

      const reportContent = reportResponse.choices[0].message.content;
      let reportData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = reportContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          reportData = JSON.parse(jsonMatch[0]);
        } else {
          reportData = JSON.parse(reportContent);
        }

        // Clean and validate diagnosis
        if (!reportData.diagnosis || reportData.diagnosis.trim() === '') {
          reportData.diagnosis =
            'Clinical assessment required - Further evaluation needed based on available data';
        } else {
          reportData.diagnosis = reportData.diagnosis.trim();
        }

        // Clean and validate healthSummary
        if (
          !reportData.healthSummary ||
          !Array.isArray(reportData.healthSummary)
        ) {
          reportData.healthSummary = [
            'Patient presented with reported symptoms',
            'Further clinical evaluation recommended',
            'Monitor symptoms and vitals closely',
            'Follow up as needed',
            'Maintain ongoing health management',
          ];
        } else {
          // Clean each string in healthSummary to remove JSON artifacts
          reportData.healthSummary = reportData.healthSummary
            .map((item) => {
              let cleaned = String(item)
                // Remove escape characters
                .replace(/\\"/g, '')
                .replace(/\\'/g, "'")
                // Remove surrounding quotes and commas
                .replace(/^[\s",']+|[\s",']+$/g, '')
                // Remove JSON-like fragments
                .replace(/\{[^}]*\}/g, '')
                // Remove any remaining quotes
                .replace(/"/g, '')
                .trim();
              return cleaned;
            })
            .filter((item) => {
              // Filter out items that look like JSON fragments or are too short
              const isClean =
                item.length > 20 &&
                !item.includes('{') &&
                !item.includes('}') &&
                !item.startsWith('"') &&
                !item.startsWith("'") &&
                !item.includes('":') &&
                !item.includes(':"') &&
                !item.match(/^[\"\']|[\"\']$/);
              return isClean;
            });

          // Ensure we have exactly 5 items
          if (reportData.healthSummary.length < 5) {
            const defaults = [
              'Patient requires ongoing monitoring',
              'Symptoms should be tracked',
              'Follow up with healthcare provider',
              'Continue current treatment plan',
              'Report any changes in condition',
            ];
            reportData.healthSummary = [
              ...reportData.healthSummary,
              ...defaults.slice(0, 5 - reportData.healthSummary.length),
            ];
          }
        }

        // Merge extracted vitals with AI-generated vitals
        if (reportData.vitals && Array.isArray(reportData.vitals)) {
          // Merge with extracted vitals from images
          const allVitals = [...extractedVitals];
          reportData.vitals.forEach((vital) => {
            // Avoid duplicates
            const exists = allVitals.some(
              (v) => v.vital_sign === vital.vital_sign
            );
            if (!exists) {
              allVitals.push(vital);
            }
          });
          reportData.vitals =
            allVitals.length > 0 ? allVitals : reportData.vitals;
        } else {
          reportData.vitals = extractedVitals.length > 0 ? extractedVitals : [];
        }

        // Ensure diseases is an array
        if (!reportData.diseases || !Array.isArray(reportData.diseases)) {
          reportData.diseases = [];
        }

        // Filter diseases with probability >= 0.3 and transform to match schema
        if (reportData.diseases.length > 0) {
          reportData.diseases = reportData.diseases
            .filter((d) => d.probability && d.probability >= 0.3)
            .map((d) => {
              // Transform from "reasoning" to "reason" if needed
              return {
                disease: d.disease,
                probability: Number(d.probability),
                risk_level: d.risk_level || d.riskLevel,
                reason:
                  d.reason ||
                  d.reasoning ||
                  'Diagnosis based on symptoms and clinical findings',
              };
            });
        }
      } catch (parseError) {
        // Fallback: Try to extract diagnosis
        let diagnosis =
          'Clinical assessment required - Further evaluation needed based on available data';
        const diagnosisMatch = reportContent.match(/"diagnosis":\s*"([^"]+)"/i);
        if (diagnosisMatch && diagnosisMatch[1]) {
          diagnosis = diagnosisMatch[1].trim();
        }

        // Extract health summary from raw text
        const healthSummary = [];
        const summaryMatch = reportContent.match(
          /"healthSummary":\s*\[([^\]]+)\]/is
        );
        if (summaryMatch) {
          const items = summaryMatch[1]
            .split(',')
            .map((item) => item.trim().replace(/^"|"$/g, ''))
            .filter(
              (item) =>
                item.length > 10 && !item.includes('{') && !item.includes('}')
            );
          healthSummary.push(...items);
        }

        // Fallback to default summary
        if (healthSummary.length < 3) {
          healthSummary.length = 0;
          healthSummary.push(
            'Clinical assessment completed',
            'Patient symptoms documented',
            'Recommendation for ongoing monitoring',
            'Follow-up required',
            'Medical history reviewed'
          );
        }

        reportData = {
          diagnosis: diagnosis,
          vitals: extractedVitals.length > 0 ? extractedVitals : [],
          healthSummary: healthSummary.slice(0, 5),
          diseases: [],
        };
      }

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////

      // Create and save the report
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////

      const report = await Report.create({
        visit: visitId,
        diagnosis: reportData.diagnosis,
        vitals: reportData.vitals,
        doctor_remarks: transcribedText || '',
        ai_health_analysis: {
          current_health_summary: reportData.healthSummary,
          predicted_disease_probability: reportData.diseases || [],
        },
      });

      // Update visit with report reference
      await Visit.findByIdAndUpdate(visitId, { report_id: report._id });

      return {
        reportId: report._id,
        visitId,
        diagnosis: reportData.diagnosis,
        vitals: reportData.vitals,
        healthSummary: reportData.healthSummary,
        diseases: reportData.diseases,
        audioTranscription: transcribedText,
        createdAt: report.created_at,
      };
    } catch (error) {
      throw new Error(`Report generation failed: ${error.message}`);
    }
  }

  async getReportById(reportId, userId, userRole) {
    const report = await Report.findById(reportId)
      .populate('visit')
      .populate({
        path: 'visit',
        populate: {
          path: 'doctor_patient_relations_id',
          populate: [
            { path: 'doctor_id', select: 'name email' },
            { path: 'patient_id', select: 'name email' },
          ],
        },
      });

    return report;
  }
}

export const aiService = new AIService();
