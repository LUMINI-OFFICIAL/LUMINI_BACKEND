import mongoose from 'mongoose';
import { makeResponse } from '@/utils/response';
import getSwitchModel from '@/models/switch';
import getRoomModel from '@/models/room';

export const getSwitch = async ( req, res ) => {
  try {
    const { id } = req.query;
    const Switch = await getSwitchModel(req.user.userId);

    // If an ID is provided, filter Switchs by ID
    if (id) {
      const Switch = await Switch.findById(id);
      if (!Switch) {
        return makeResponse({res, status: 404, message: "Switch not found"});
      }
      return makeResponse({ res, data: Switch });
    }

    // If no ID is provided, retrieve all Switchs
    const Switchs = await Switch.find();
    return makeResponse({ res, data: Switchs });
  } catch (err) {
    return makeResponse({res, status: 500, message: "Internal server error" });
  }
};

export const addSwitch = async ( req, res ) => {
  try {
    const { name, state, roomId } = req.body;
    const Switch = await getSwitchModel(req.user.userId);
    const Room = await getRoomModel(req.user.userId);

    const newSwitch = new Switch({ name, state, roomId });
    await newSwitch.save();
    
    // Check if the room with the provided ID exists
    const room = await Room.findById(roomId);
    if (!room) {
      return makeResponse({res, status: 404, message: "Room not found"});
    }
    
    // Add the switch ID to the room's switches array
    room.switches.push(newSwitch.__id);
    await room.save();

    return makeResponse({res, status: 201, data: newSwitch});
  } catch (err) {
    return makeResponse({res, status: 500, message: "Internal Server Error"});
  }
};

export const updateSwitch = async ( req, res ) => {
  try {
    const { id } = req.params;
    const { name, state, roomId } = req.body;

    const Switch = await getSwitchModel(req.user.userId);
    const Room = await getRoomModel(req.user.userId);

    // Validate that the provided switch ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return makeResponse({res, status: 400, message: "Invalid switch ID"});
    }

    // Check if the switch with the provided ID exists
    const existingSwitch = await Switch.findById(id);
    if (!existingSwitch) {
      return makeResponse({res, status: 404, message: "Switch not found"});
    }

    // Update switch fields
    if (name) {
      existingSwitch.name = name;
    }
    if (typeof state === 'boolean') {1
      existingSwitch.state = state;
    }
    if (roomId) {
      // Fetch the switch's current room
      const previousRoomId = existingSwitch.roomId;

      // Update roomId of the switch
      existingSwitch.roomId = roomId;
      
      // Check if the provided roomId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return makeResponse({res, status: 400, message: "Invalid room ID"});
      }
      
      // Check if the room with the provided ID exists
      const room = await Room.findById(roomId);
      if (!room) {
        return makeResponse({res, status: 404, message: "Room not found"});
      }

      // If the switch was associated with a previous room, remove its ID from that room's switches array
      if (previousRoomId) {
        const previousRoom = await Room.findById(previousRoomId);
        if (previousRoom) {
          previousRoom.switches = previousRoom.switches.filter(s => s.toString() !== id);
          await previousRoom.save();
        }
      }
      
      // Check if the switch ID is already present in the room's switches array
      if (!room.switches.includes(id)) {
        room.switches.push(id);
        await room.save();
      }
    }

    // Save the updated switch
    await existingSwitch.save();
    
    // Respond with the updated switch
    return makeResponse({res, data: existingSwitch});
  } catch (err) {
    console.error(err);
    return makeResponse({res, status: 500, message: "Internal server error"});
  }
};

export const removeSwitch = async ( req, res ) => {
  try {
    const { id } = req.params;
    const Switch = await getSwitchModel(req.user.userId);
    
    const deletedSwitch = await Switch.findByIdAndDelete(id);

    if (!deletedSwitch) {
      return makeResponse({ res, status: 404, message: "Switch not found" });
    }
    return makeResponse({ res, message: "Switch deleted successfully" });
  } catch (err) {
    return makeResponse({ res, status: 500, message: "Internal server error" });
  }
};