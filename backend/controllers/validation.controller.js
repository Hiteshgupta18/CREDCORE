const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all validations
exports.getAllValidations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const where = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [validations, total] = await Promise.all([
      prisma.hospitalValidation.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          hospital: { select: { id: true, name: true, registrationNo: true } }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.hospitalValidation.count({ where })
    ]);

    res.json({
      success: true,
      data: validations,
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

// Get validation by ID
exports.getValidationById = async (req, res) => {
  try {
    const validation = await prisma.hospitalValidation.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        hospital: true
      }
    });

    if (!validation) {
      return res.status(404).json({ success: false, error: 'Validation not found' });
    }

    res.json({ success: true, data: validation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create validation (OCR result)
exports.createValidation = async (req, res) => {
  try {
    const { userId, hospitalId, inputData, extractedInfo, validationScore } = req.body;

    const validation = await prisma.hospitalValidation.create({
      data: {
        userId,
        hospitalId,
        inputData,
        extractedInfo,
        validationScore: validationScore || 0.0,
        status: 'PENDING'
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        hospital: true
      }
    });

    res.status(201).json({ success: true, data: validation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update validation status
exports.updateValidationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validation = await prisma.hospitalValidation.update({
      where: { id: req.params.id },
      data: {
        status,
        notes,
        validatedAt: new Date()
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        hospital: true
      }
    });

    res.json({ success: true, data: validation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get validations by user
exports.getValidationsByUser = async (req, res) => {
  try {
    const validations = await prisma.hospitalValidation.findMany({
      where: { userId: req.params.userId },
      include: {
        hospital: { select: { id: true, name: true, registrationNo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: validations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get validations by hospital
exports.getValidationsByHospital = async (req, res) => {
  try {
    const validations = await prisma.hospitalValidation.findMany({
      where: { hospitalId: req.params.hospitalId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: validations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
