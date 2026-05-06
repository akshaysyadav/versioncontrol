const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();
const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
}

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
}

async function getAllUsers (req, res) {
    try{
        await connectClient();
        const db = client.db('versionControl');
        const usersCollection = db.collection('users');

        const users = await usersCollection.find({}).toArray();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function signUp(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    try {
        await connectClient();
        const db = client.db('versionControl');
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            repository: [],
            followedUsers: [],
            starRepos: []
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jsonwebtoken.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            message: 'User created successfully',
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

async function login(req, res){
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db('versionControl');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token , userId : user._id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


async function getUserProfile(req, res) {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        await connectClient();
        const db = client.db('versionControl');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user.password;
        return res.status(200).json(user);

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateUserProfile (req, res) {
    res.send("update user profile");
}

async function deleteUserProfile (req, res) {
    res.send("delete user profile");
}   

module.exports = {
    getAllUsers,
    signUp,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};