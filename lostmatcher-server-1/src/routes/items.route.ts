// import express from 'express';
// import {
//     createItemController,
//     getItemByIdController,
//     updateItemByIdController,
//     deleteItemByIdController,
//     getAllItemsController,
//     searchItemsByDescriptionController
// } from '../controllers/item.controller';
// import{
//     createItem,
//     updateItem,
//     searchItemsByDescription,
//     getItem,
//     deleteItem
//   } from '../validations/item.validation'
// import validate from '../middlewares/validate';

// const router = express.Router();

// // Route to create a new item
// router.post('/',validate(createItem), createItemController);

// // Route to get all items
// router.get('/',getAllItemsController);

// // Route to get a specific item by ID
// router.get('/itemdescription',validate(searchItemsByDescription), searchItemsByDescriptionController);

// // Route to get a specific item by ID
// router.get('/:id',validate(getItem), getItemByIdController);

// // Route to update an item by ID
// router.put('/:id',validate(updateItem), updateItemByIdController);

// // Route to delete an item by ID
// router.delete('/:id',validate(deleteItem), deleteItemByIdController);

// export default router;
