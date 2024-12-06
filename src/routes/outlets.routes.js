import express from "express";
import { getOutlet, addOutlet, updateOutlet, removeOutlet } from "@/controllers/outlet";

const OutletRouter = express.Router();

OutletRouter.get('/', getOutlet);
OutletRouter.get('/:id', getOutlet);
OutletRouter.post('/', addOutlet);
OutletRouter.put('/:id', updateOutlet);
OutletRouter.delete('/:id', removeOutlet);

export default OutletRouter;