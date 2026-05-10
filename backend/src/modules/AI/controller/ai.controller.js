import { aiService } from '../service/ai.service.js';

const CONSULTATION_ROLES = new Set(['user', 'assistant']);

/**
 * Generate a short AI consultation response without exposing provider keys to the browser.
 */
const generateConsultation = async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];

    const sanitizedMessages = messages
      .filter(
        (message) =>
          CONSULTATION_ROLES.has(message?.role) &&
          typeof message?.content === 'string' &&
          message.content.trim()
      )
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }));

    if (!sanitizedMessages.length) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'At least one message is required',
      });
    }

    const content = await aiService.generateConsultationResponse({
      messages: sanitizedMessages,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: { content },
      message: 'Consultation response generated successfully',
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to generate consultation response',
    });
  }
};

/**
 * Generate a comprehensive medical report with audio transcription and image analysis
 */
const generateReport = async (req, res) => {
  try {
    const { visitId, text, userId } = req.body;
    const audioFile = req.file; // Changed from req.files to req.file for single file upload

    console.log(
      'Audio file received:',
      audioFile
        ? {
            filename: audioFile.originalname,
            path: audioFile.path,
            mimetype: audioFile.mimetype,
            size: audioFile.size,
          }
        : 'No audio file'
    );

    // Validate that either audio file or text is provided
    if (!audioFile && !text) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Either audio file or text input is required',
      });
    }

    const report = await aiService.generateComprehensiveReport({
      visitId,
      audioFile,
      text,
      userId,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: report,
      message: 'Report generated successfully',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to generate report',
    });
  }
};

/**
 * Get report by ID
 */
// const getReportById = async (req, res) => {
//   try {
//     const { reportId } = req.params;
//     const userId = req.user.id;
//     const userRole = req.user.role;

//     const report = await aiService.getReportById(reportId, userId, userRole);

//     if (!report) {
//       return res.status(404).json({
//         success: false,
//         statusCode: 404,
//         message: 'Report not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       statusCode: 200,
//       data: report,
//       message: 'Report retrieved successfully',
//     });
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       statusCode: error.statusCode || 500,
//       message: error.message || 'Failed to retrieve report',
//     });
//   }
// };

export { generateConsultation, generateReport };
