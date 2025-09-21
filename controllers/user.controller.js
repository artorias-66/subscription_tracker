import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// GET all users (admin or open)
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password'); // hide passwords
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('[getUsers] Error:', error);
        next(error);
    }
};

// GET a single user by ID
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('[getUser] Error:', error);
        next(error);
    }
};

// CREATE new user
export const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            success: true,
            data: { ...newUser.toObject(), password: undefined }
        });
    } catch (error) {
        console.error('[createUser] Error:', error);
        next(error);
    }
};

// UPDATE user
export const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const updates = { ...req.body };
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        Object.assign(user, updates);
        await user.save();

        res.status(200).json({
            success: true,
            data: { ...user.toObject(), password: undefined }
        });
    } catch (error) {
        console.error('[updateUser] Error:', error);
        next(error);
    }
};

// DELETE user
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        await user.remove();
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('[deleteUser] Error:', error);
        next(error);
    }
};
