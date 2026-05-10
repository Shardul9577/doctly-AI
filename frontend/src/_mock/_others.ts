import _mock from './_mock';
import { randomInArray } from './funcs';

// ----------------------------------------------------------------------

export const _carouselsExample = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.text.title(index),
  image: _mock.image.feed(index),
  description: _mock.text.description(index),
}));

export const _carouselsMembers = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  role: _mock.role(index),
  avatar: '/images/avatar.svg',
}));

// ----------------------------------------------------------------------

export const _faqs = [...Array(8)].map((_, index) => {
  const data = [
    {
      heading: 'What is Doctly?',
      detail:
        'Doctly is an AI-powered platform that assists doctors with real-time medical documentation and early disease detection.',
    },
    {
      heading: 'How does Doctly help doctors?',
      detail:
        'It listens during patient consultations and auto-generates structured medical notes, saving time and reducing errors.',
    },
    {
      heading: 'Is patient data secure with Doctly?',
      detail:
        'Yes, Doctly uses end-to-end encryption and complies with HIPAA and Indian data protection standards.',
    },
    {
      heading: 'Does Doctly work in real-time?',
      detail:
        'Yes, it captures and processes conversations live, generating notes instantly during consultations.',
    },
    {
      heading: 'Can Doctly detect early signs of disease?',
      detail:
        'Yes, it uses AI to analyze symptoms and flag early indicators of conditions like diabetes and hypertension.',
    },
    {
      heading: 'Is Doctly suitable for small clinics?',
      detail:
        'Absolutely. Doctly is designed to work for solo doctors, small practices, and large hospitals alike.',
    },
    {
      heading: 'Does it integrate with existing systems?',
      detail:
        'Yes, Doctly offers APIs that integrate easily with EMR, HIS, and insurance platforms.',
    },
    {
      heading: 'How can I start using Doctly?',
      detail:
        'You can request early access through our website or schedule a free demo with our team.',
    },
  ];

  return {
    id: `faq-${index + 1}`,
    value: `panel${index + 1}`,
    heading: data[index].heading,
    detail: data[index].detail,
  };
});

// ----------------------------------------------------------------------

export const _addressBooks = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  receiver: _mock.name.fullName(index),
  fullAddress: _mock.address.fullAddress(index),
  phone: _mock.phoneNumber(index),
  addressType: index === 0 ? 'Home' : 'Office',
  isDefault: index === 0,
}));

// ----------------------------------------------------------------------

export const _skills = [...Array(3)].map((_, index) => ({
  label: ['Development', 'Design', 'Marketing'][index],
  value: _mock.number.percent(index),
}));

// ----------------------------------------------------------------------

export const _accordions = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Accordion ${index + 1}`,
  subHeading: _mock.text.title(index),
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export const _dataGrid = [...Array(36)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  email: _mock.email(index),
  lastLogin: _mock.time(index),
  performance: _mock.number.percent(index),
  rating: _mock.number.rating(index),
  status: randomInArray(['online', 'away', 'busy']),
  isAdmin: _mock.boolean(index),
  lastName: _mock.name.lastName(index),
  firstName: _mock.name.firstName(index),
  age: _mock.number.age(index),
}));

// ----------------------------------------------------------------------

export const _megaMenuProducts = [...Array(10)].map((_, index) => ({
  name: _mock.text.title(index),
  image: _mock.image.feed(index),
  path: '#',
}));

// ----------------------------------------------------------------------

export const _contacts = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  username: _mock.name.fullName(index),
  avatar: _mock.image.avatar(index),
  address: _mock.address.fullAddress(index),
  phone: _mock.phoneNumber(index),
  email: _mock.email(index),
  lastActivity: _mock.time(index),
  status: randomInArray(['online', 'offline', 'away', 'busy']),
  position: _mock.role(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  title: [
    'Your order is placed',
    'Sylvan King',
    'You have new message',
    'You have new mail',
    'Delivery processing',
  ][index],
  description: [
    'waiting for shipping',
    'answered to your comment on the Minimal',
    '5 unread messages',
    'sent from Guido Padberg',
    'Your order is being shipped',
  ][index],
  avatar: [null, _mock.image.avatar(2), null, null, null][index],
  type: [
    'order_placed',
    'friend_interactive',
    'chat_message',
    'mail',
    'order_shipped',
  ][index],
  createdAt: _mock.time(index),
  isUnRead: [true, true, false, false, false][index],
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  {
    latlng: [33, 65],
    address: _mock.address.fullAddress(1),
    phoneNumber: _mock.phoneNumber(1),
  },
  {
    latlng: [-12.5, 18.5],
    address: _mock.address.fullAddress(2),
    phoneNumber: _mock.phoneNumber(2),
  },
];
