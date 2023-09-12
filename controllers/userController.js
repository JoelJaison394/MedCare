import { vault , audit , PangeaErrors } from '../pangeaConfig.js';
import { prisma } from '../prismaConfig.js'
import logger from '../logger.js';
import dotenv from 'dotenv';
dotenv.config();


const userController = {
 registerUsers : async (req, res) => {
  try {
    const {
      email,
      id,
      firstName,
      lastName,
      phoneNumber,
      profileImg,
      dateOfBirth,
      bio,
      password,
      address,
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: 'Email, firstName, lastName, phoneNumber, and password are required.' });
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phoneNumber,
        profileImg,
        dateOfBirth,
        bio,
        password,
        address: {
          create: {
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
          },
        },
      },
    });

    // Generate a JWT token
    await vault.jwkGet(process.env.PANGEA_USERAUTH_JWTSECRECT);
    const payload = {
      sub: id,
      email: email,
      userID: newUser.id,
    };
    const jwtResponse = await vault.jwtSign(
      process.env.PANGEA_USERAUTH_JWTSECRECT,
      JSON.stringify(payload)
    );
    const signedJWT = jwtResponse.result.jws;

    const clientIp = req.ip;

    // Create a audit log
    const auditData = {
      action: "Account creation",
      actor: `${firstName} ${lastName}`,
      target: email,
      status: "success",
      message: `User created from the req - ${clientIp}`,
      source: "web",
    };

    const logResponse = await audit.log(auditData, { verbose: true });

    await prisma.auditLog.create({
      data: {
        action: "Account creation",
        actor: `${firstName} ${lastName}`,
        target: email,
        status: "success",
        message: `User created from the req - ${clientIp}`,
        source: "web",
        userId: newUser.id,
      },
    });

    const responsePayload = {
      message: 'User registered successfully',
      user: newUser,
      token: signedJWT,
    };

    logger.info(`User registered: ${email}`);

    // Set the JWT token 
    res.cookie('jwtToken', signedJWT, {
      secure: true,
      httpOnly: true,
      maxAge: 3600000,
    }).status(201).json(responsePayload);
  } catch (error) {
    // Log errors 
    logger.error('Error during registration:', error);

    if (error instanceof PangeaErrors.APIError) {
      console.log(error.summary, error.pangeaResponse);
    }

    console.error(error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
},
};

export default userController;