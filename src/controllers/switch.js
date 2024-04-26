import mongoose from 'mongoose';
import createError from 'http-errors';
import Switch from '@/models/switch';
import Room from '@/models/room';
import { makeResponse } from '@/utils/response';

export const getSwitch = () => {

};

export const addSwitch = async ( req, res ) => {
  try {
    const { name, state, roomId } = req.body;
    const newSwitch = new Switch({ name, state, roomId });
    await newSwitch.save();
    
    // Check if the room with the provided ID exists
    const room = await Room.findById(roomId);
    if (!room) {
      throw createError(404, "Room not found");
    }
    
    // Add the switch ID to the room's switches array
    room.switches.push(newSwitch.__id);
    await room.save();

    makeResponse({res, status: 201, data: newSwitch});
  } catch (err) {
    createError[400, err.message];
  }
};

export const updateSwitch = async ( req, res ) => {
  try {
    const { id } = req.params;
    const { name, state, roomId } = req.body;

    // Validate that the provided switch ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError[400, "Invalid switch ID" ];
    }

    // Check if the switch with the provided ID exists
    const existingSwitch = await Switch.findById(id);
    if (!existingSwitch) {
      throw createError[404, "Switch not found" ];
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
        throw createError[400, "Invalid room ID"];
      }
      
      // Check if the room with the provided ID exists
      const room = await Room.findById(roomId);
      if (!room) {
        throw createError[404, "Room not found"];
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
    makeResponse({res, data: existingSwitch});
  } catch (err) {
    console.error(err);
    createError[500, "Internal server error" ];
  }
};

export const removeSwitch = () => {

};