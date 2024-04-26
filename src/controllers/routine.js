import mongoose from 'mongoose';
import Routine from "@/models/routine";
import createError from "http-errors";
import { makeResponse } from "@/utils/response";

export const getRoutine = async (req, res) => {
  try {
    const routines = await Routine.find();
    makeResponse({ res, data: routines });
  } catch (err) {
    console.error(err);
    createError(500, "Internal server error");
  }
};

export const addRoutine = async (req, res) => {
  try {
    const { name, actions, schedule } = req.body;
    const newRoutine = new Routine({ name, actions, schedule });
    await newRoutine.save();
    makeResponse({ res, data: newRoutine, status: 201 });
  } catch (err) {
    console.error(err);
    createError(500, "Internal server error");
  }
};

export const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, actions, schedule } = req.body;

    // Validate that the provided routine ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid routine ID");
    }

    // Check if the routine with the provided ID exists
    const existingRoutine = await Routine.findById(id);
    if (!existingRoutine) {
      throw createError(404, "Routine not found");
    }

    // Update routine fields
    if (name) {
      existingRoutine.name = name;
    }
    if (actions) {
      existingRoutine.actions = actions;
    }
    if (schedule) {
      existingRoutine.schedule = schedule;
    }

    // Save the updated routine
    await existingRoutine.save();

    // Respond with the updated routine
    makeResponse({ res, data: existingRoutine });
  } catch (err) {
    console.error(err);
    createError(500, "Internal server error");
  }
};

export const removeRoutine = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the provided routine ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid routine ID");
    }

    // Check if the routine with the provided ID exists
    const existingRoutine = await Routine.findById(id);
    if (!existingRoutine) {
      throw createError(404, "Routine not found");
    }

    // Remove the routine
    await Routine.findByIdAndDelete(id);

    // Respond with success message
    makeResponse({ res, message: "Routine deleted successfully" });
  } catch (err) {
    console.error(err);
    createError(500, "Internal server error");
  }
};
