import { CustomHelpers } from 'joi';

const objectId = (value: string, helpers: CustomHelpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.message({ message: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};

const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({ message: 'password must be at least 8 characters' });
  }
  if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
    return helpers.message({ message: 'password must contain at least 1 letter and 1 number' });
  }
  return value;
};

const phoneNumber = (value: string, helpers: CustomHelpers) => {
  // Check if the phone number contains only digits
  if (!/^\d+$/.test(value)) {
    return helpers.message({ message: 'phone number must contain only digits' });
  }
  // Check if the phone number is exactly 9 digits long
  if (value.length !== 9) {
    return helpers.message({ message: 'phone number must be exactly 9 digits' });
  }
  return value;
};

export { objectId, password, phoneNumber };
