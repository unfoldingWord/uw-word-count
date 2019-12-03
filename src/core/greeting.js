export const greetName = ({name}) => {
  const greeting = (typeof name === 'string') ? `Hello ${name}` : `Hello!`;
  return greeting;
};