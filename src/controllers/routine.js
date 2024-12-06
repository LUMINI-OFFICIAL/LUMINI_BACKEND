import mongoose from 'mongoose';
import getRoutineModel from '@/models/routine';
import { makeResponse } from "@/utils/response";

export const fetchRoutineData = async (userId) => {
  try {
    const Routine = await getRoutineModel(userId);
    const routines = await Routine.find();
    return routines;
  } catch (err) {
    console.error(err);
  }
};

export const getRoutine = async (req, res) => {
  try {
    const routines = await fetchRoutineData(req.user.userId);
    return makeResponse({ res, data: routines });
  } catch (err) {
    return makeResponse({res, status: 500, message: "Internal server error"});
  }
};

export const addRoutine = async (req, res) => {
  try {
    let { name, state, actions, schedule } = req.body;
    const Routine = await getRoutineModel(req.user.userId);
    if (name == "Preset") {
      let count = (await Routine.countDocuments() + 1).toLocaleString();
      name += " " + count;
    }
    const newRoutine = new Routine({ name, state, actions, schedule });
    await newRoutine.save();
    return makeResponse({ res, data: newRoutine, status: 201 });
  } catch (err) {
    console.error(err);
    return makeResponse({res, status: 500, message: "Internal server error"});
  }
};

export const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, actions, schedule } = req.body;
    const Routine = await getRoutineModel(req.user.userId);
    // Validate that the provided routine ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return makeResponse({res, status: 400, message: "Invalid routine ID"});
    }

    // Check if the routine with the provided ID exists
    const existingRoutine = await Routine.findById(id);
    if (!existingRoutine) {
      return makeResponse({res, status: 404, message: "Routine not found"});
    }

    // Update routine fields
    if (name) {
      existingRoutine.name = name;
    }
    if (state) {
      existingRoutine.state = state;
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
    return makeResponse({ res, data: existingRoutine });
  } catch (err) {
    return makeResponse({res, status: 500, message: "Internal server error"});
  }
};

export const removeRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const Routine = await getRoutineModel(req.user.userId);

    // Validate that the provided routine ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return makeResponse({res, status: 400, message: "Invalid routine ID"});
    }

    // Check if the routine with the provided ID exists
    const existingRoutine = await Routine.findById(id);
    if (!existingRoutine) {
      return makeResponse({res, status: 404, message: "Routine not found"});
    }

    // Remove the routine
    await Routine.findByIdAndDelete(id);

    // Respond with success message
    return makeResponse({ res, message: "Routine deleted successfully" });
  } catch (err) {
    return makeResponse({res, status: 500, message: "Internal server error"});
  }
};
