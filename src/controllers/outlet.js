import mongoose from 'mongoose';
import getOutletModel from '@/models/outlet';
import { makeResponse } from "@/utils/response";

export const getOutlet = async (req, res) => {
  try {
    const { id } = req.query;
    const Outlet = await getOutletModel(req.user.userId);

    // If an ID is provided, filter outlets by ID
    if (id) {
      const outlet = await Outlet.findById(id)
          .populate({ path: 'moduleConfig' });
      if (!outlet) {
        return makeResponse({res, status: 404, message: "Outlet not found"});
      }
      return makeResponse({ res, data: outlet });
    }

    // If no ID is provided, retrieve all outlets
    const outlets = await Outlet.find();
    return makeResponse({ res, data: outlets });
  } catch (err) {
    return makeResponse({res, status: 500, message: "Internal server error" });
  }
};

export const addOutlet = async (req, res) => {
  try {
    const { name, state, roomId, moduleType, moduleConfig } = req.body;
    const Outlet = await getOutletModel(req.user.userId);

    const outlet = new Outlet({ name, state, roomId, moduleType, moduleConfig });
    await outlet.save();
    return makeResponse({ res, status: 201, data: outlet });
  } catch (err) {
    return makeResponse({ res, status: 500, message: "Internal server error" });
  }
};

export const updateOutlet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, roomId, moduleType, moduleConfig } = req.body;
    const Outlet = await getOutletModel(req.user.userId);

    // Validate that the provided outlet ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return makeResponse({res, status: 400, message: "Invalid outlet ID"});
    }

    // Check if the outlet with the provided ID exists
    const existingOutlet = await Outlet.findById(id);
    if (!existingOutlet) {
      return makeResponse({res, status: 404, message: "Outlet not found"});
    }

    // Update outlet fields
    if (name) {
      existingOutlet.name = name;
    }
    if (typeof state === 'boolean') {
      existingOutlet.state = state;
    }
    if (roomId) {
      // Fetch the outlet's current room
      const previousRoomId = existingOutlet.roomId;

      // Update roomId of the outlet
      existingOutlet.roomId = roomId;

      // Check if the provided roomId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return makeResponse({res, status: 400, message: "Invalid room ID"});
      }

      // Check if the room with the provided ID exists
      const room = await Room.findById(roomId);
      if (!room) {
        return makeResponse({res, status: 404, message: "Room not found"});
      }

      // If the outlet was associated with a previous room, remove its ID from that room's outlets array
      if (previousRoomId) {
        const previousRoom = await Room.findById(previousRoomId);
        if (previousRoom) {
          previousRoom.outlets = previousRoom.outlets.filter(o => o.toString() !== id);
          await previousRoom.save();
        }
      }

      // Check if the outlet ID is already present in the room's outlets array
      if (!room.outlets.includes(id)) {
        room.outlets.push(id);
        await room.save();
      }
    }

    // Update moduleType if provided
    if (moduleType) {
      // Check if the provided moduleType is valid by querying the Module model
      const module = await Module.findOne({ type: moduleType });
      if (!module) {
        return makeResponse({res, status: 400, message: "Invalid moduleType"});
      }

      existingOutlet.moduleType = moduleType;

      // Check if moduleConfig is provided
      if (moduleConfig && typeof moduleConfig === 'object') {
        // Compare the keys of moduleConfig and module.config
        const moduleConfigKeys = Object.keys(moduleConfig);
        const moduleKeys = Object.keys(module.config);

        // Check if the keys match
        if (moduleConfigKeys.length === moduleKeys.length && moduleConfigKeys.every(key => moduleKeys.includes(key))) {
          // Check if the types of the values match the schema defined in Module.model
          const isValidConfig = moduleKeys.every(key => typeof moduleConfig[key] === typeof module.config[key]);
          if (isValidConfig) {
            existingOutlet.moduleConfig = moduleConfig;
          } else {
            return makeResponse({res, status: 400, message: "Invalid moduleConfig"});
          }
        } else {
          return makeResponse({res, status: 400, message: "Invalid moduleConfig"});
        }
      } else {
        return makeResponse({res, status: 400, message: "moduleConfig is required"});
      }
    }

    // Save the updated outlet
    await existingOutlet.save();

    // Respond with the updated outlet
    return makeResponse({ res, data: existingOutlet });
  } catch (err) {
    return makeResponse({res, status: 500, message: "Internal server error"});
  }
};

export const removeOutlet = async (req, res) => {
  try {
    const { id } = req.params;
    const Outlet = await getOutletModel(req.user.userId);
    
    const deletedOutlet = await Outlet.findByIdAndDelete(id);

    if (!deletedOutlet) {
      return makeResponse({ res, status: 404, message: "Outlet not found" });
    }
    return makeResponse({ res, message: "Outlet deleted successfully" });
  } catch (err) {
    return makeResponse({ res, status: 500, message: "Internal server error" });
  }
};