import Joi from 'joi';
import {objectId} from './custom.validation';
const createItem = {
  body: Joi.object().keys({
    imageURL: Joi.string().uri().required().trim(),
    description: Joi.string().required().trim(),
    missingLocation: Joi.string().required().trim(),
    name: Joi.string().required().trim(),
    currentLocation: Joi.object().keys({
      townOrVillage: Joi.string().trim(),
      quarter: Joi.string().trim(),
      specificPlace: Joi.string().trim(),
    }).when('type', {
      is: 'found',
      then: Joi.object({
        townOrVillage: Joi.string().required().trim(),
        quarter: Joi.string().required().trim(),
        specificPlace: Joi.string().required().trim(),
      }).required(),
    }),
    contactPersonContact: Joi.string().required().trim().default('no match'),
    status: Joi.string().valid('no match', 'pending claim', 'claim approved', 'further verification required').default('no match'),
    type: Joi.string().valid('lost', 'found').default('found'),
    date: Joi.date().iso().default(new Date(Date.now())),
    userId: Joi.string().optional().trim().default('not set'),
  }),
};

const updateItem = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
      imageURL: Joi.string().uri().optional().trim(),
      description: Joi.string().optional().trim(),
      missingLocation: Joi.string().optional().trim(),
      name: Joi.string().optional().trim(),
      currentLocation: Joi.object().keys({
        townOrVillage: Joi.string().trim().optional(),
        quarter: Joi.string().trim().optional(),
        specificPlace: Joi.string().trim().optional(),
      }).optional(),
      contactPersonContact: Joi.string().trim().optional(),
      status: Joi.string().valid('no match', 'pending claim', 'claim approved', 'further verification required').optional(),
      type: Joi.string().valid('lost', 'found').optional(),
      date: Joi.date().iso().optional(),
      userId: Joi.string().optional().trim(),
    }).min(1), // Ensure at least one field is being updated
  };
  const searchItemsByDescription = {
    query: Joi.object().keys({
      description: Joi.string().required().trim(),
    }),
  };
  const deleteItem = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
    })
  };

  const getItem={
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
    })
  }

  export{
    createItem,
    updateItem,
    searchItemsByDescription,
    getItem,
    deleteItem
  }