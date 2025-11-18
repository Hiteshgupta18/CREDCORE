const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const { status, type, verified, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (type) where.hospitalType = type;
    if (verified !== undefined) where.isVerified = verified === 'true';

    const skip = (page - 1) * limit;

    const [hospitals, total] = await Promise.all([
      prisma.hospital.findMany({
        where,
        include: {
          addresses: true,
          schemes: {
            include: { scheme: true }
          },
          credentials: true
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.hospital.count({ where })
    ]);

    res.json({
      success: true,
      data: hospitals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: req.params.id },
      include: {
        addresses: true,
        schemes: {
          include: { scheme: true }
        },
        credentials: true,
        validations: true,
        documents: true
      }
    });

    if (!hospital) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }

    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new hospital
exports.createHospital = async (req, res) => {
  try {
    const { 
      name, 
      registrationNo, 
      licenseNumber, 
      email, 
      phone, 
      website, 
      hospitalType,
      addresses = [],
      credentials = []
    } = req.body;

    const hospital = await prisma.hospital.create({
      data: {
        name,
        registrationNo,
        licenseNumber,
        email,
        phone,
        website,
        hospitalType,
        addresses: {
          create: addresses
        },
        credentials: {
          create: credentials
        }
      },
      include: {
        addresses: true,
        credentials: true
      }
    });

    res.status(201).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update hospital
exports.updateHospital = async (req, res) => {
  try {
    const hospital = await prisma.hospital.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        addresses: true,
        schemes: { include: { scheme: true } },
        credentials: true
      }
    });

    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete hospital
exports.deleteHospital = async (req, res) => {
  try {
    await prisma.hospital.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Search hospitals
exports.searchHospitals = async (req, res) => {
  try {
    const { q, city, zone } = req.query;

    const where = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { registrationNo: { contains: q, mode: 'insensitive' } },
        { licenseNumber: { contains: q, mode: 'insensitive' } }
      ]
    };

    if (city || zone) {
      where.addresses = {
        some: {
          ...(city && { city: { contains: city, mode: 'insensitive' } }),
          ...(zone && { zone: { contains: zone, mode: 'insensitive' } })
        }
      };
    }

    const hospitals = await prisma.hospital.findMany({
      where,
      include: {
        addresses: true,
        schemes: { include: { scheme: true } }
      },
      take: 20
    });

    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get hospitals by scheme
exports.getHospitalsByScheme = async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      where: {
        schemes: {
          some: {
            schemeId: req.params.schemeId,
            isActive: true
          }
        }
      },
      include: {
        addresses: true,
        schemes: { include: { scheme: true } }
      }
    });

    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify hospital
exports.verifyHospital = async (req, res) => {
  try {
    const { verificationScore, notes } = req.body;

    const hospital = await prisma.hospital.update({
      where: { id: req.params.id },
      data: {
        status: 'VERIFIED',
        isVerified: true,
        verifiedAt: new Date(),
        verificationScore: verificationScore || 1.0
      }
    });

    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
