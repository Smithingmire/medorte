import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password, phone, role, specialization, licenseNumber, clinicAddress, degreeCertificateUrl } = req.body;

  try {
    if (role === 'Admin') {
      return res.status(403).json({ message: 'Admin registration is restricted. Please use provided credentials.' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      specialization,
      licenseNumber,
      clinicAddress,
      degreeCertificateUrl
    });

    if (user) {
      if (user.role === 'Doctor') {
        res.status(201).json({
          message: 'Registration successful! Your account is pending Admin verification.',
          role: user.role
        });
      } else {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.role === 'Doctor') {
        if (user.status === 'Unverified') {
          return res.status(403).json({ message: 'Your account is pending verification by an Admin.' });
        }
        if (user.status === 'Rejected') {
          return res.status(403).json({ message: 'Your application has been rejected by an Admin.' });
        }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
