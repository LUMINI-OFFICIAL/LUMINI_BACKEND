import mongoose from 'mongoose';
import createError from 'http-errors';
import { makeResponse } from '@/utils/response';
import getRoomModel from '@/models/room';

export const addRoom = async ( req, res ) => {
  try {
    let { name, switches, outlets } = req.body;
    const Room = await getRoomModel(req.user.userId);
    if (name == "New Room") {
      let count = (await Room.countDocuments() + 1).toLocaleString();
      name += " " + count;
    }
    const newRoom = new Room({ name, switches, outlets });
    await newRoom.save();
    return makeResponse({res, status: 201, data: newRoom});
  } catch (err) {
    console.error(err.message);
    createError[400, err.message];
  }
};

export const fetchRoomData = async (userId, roomId) => {
  try {
    const Room = await getRoomModel(userId);

    // If an ID is provided, filter rooms by ID
    if (roomId) {
      const room = await Room.findById(roomId)
          .populate([
            { path: 'switches' },
            { path: 'outlets', populate: { path: 'moduleConfig' }}
          ]);
      if (!room) {
        return;
      }
      return room;
    }

    // If no ID is provided, retrieve all rooms
    const rooms = await Room.find();
    return rooms;
  } catch (err) {
    console.error(err.message);
  }
};

export const getRoom = async ( req, res ) => {
  try {
    const { id } = req.query;

    const data = await fetchRoomData(req.user.userId, id);

    return makeResponse({res, data});
  } catch (err) {
    console.error(err.message);
    return createError[500, "Internal server error" ];
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, switchId, outletId } = req.body;

    const Room = await getRoomModel(req.user.userId);

    // Validate that the provided room ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid room ID");
    }

    // Check if the room with the provided ID exists
    const existingRoom = await Room.findById(id);
    if (!existingRoom) {
      throw createError(404, "Room not found");
    }

    // Update room name if provided
    if (name) {
      existingRoom.name = name;
    }

    // Update switch's roomId if provided
    if (switchId) {
      // Check if the provided switch ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(switchId)) {
        throw createError(400, "Invalid switch ID");
      }

      // Find the switch and update its roomId
      const switchItem = await Switch.findById(switchId);
      if (switchItem) {
        switchItem.roomId = id;
        await switchItem.save();
        // Add switchId to room's switches array if not already present
        if (!existingRoom.switches.includes(switchId)) {
          existingRoom.switches.push(switchId);
        }
      }
    }

    // Update outlet's roomId if provided
    if (outletId) {
      // Check if the provided outlet ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(outletId)) {
        throw createError(400, "Invalid outlet ID");
      }

      // Find the outlet and update its roomId
      const outlet = await Outlet.findById(outletId);
      if (outlet) {
        outlet.roomId = id;
        await outlet.save();
        // Add outletId to room's outlets array if not already present
        if (!existingRoom.outlets.includes(outletId)) {
          existingRoom.outlets.push(outletId);
        }
      }
    }

    // Save the updated room
    await existingRoom.save();

    // Respond with the updated room
    makeResponse({ res, data: existingRoom });
  } catch (err) {
    console.error(err);
    createError(500, "Internal server error");
  }
};


export const removeRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const Room = await getRoomModel(req.user.userId);

    // Validate that the provided room ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid room ID");
    }

    // Check if the room with the provided ID exists
    const existingRoom = await Room.findById(id);
    if (!existingRoom) {
      throw createError(404, "Room not found");
    }

    // Update all switches associated with the room
    await Switch.updateMany({ roomId: id }, { $set: { roomId: null } });

    // Update all outlets associated with the room
    await Outlet.updateMany({ roomId: id }, { $set: { roomId: null } });

    // Remove the room
    await Room.findByIdAndDelete(id);

    // Respond with success message
    makeResponse({ res, message: "Room deleted successfully" });
  } catch (err) {
    console.error(err);
    createError(500, "Internal server error");
  }
};
