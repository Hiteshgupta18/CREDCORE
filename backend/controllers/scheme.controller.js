const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all schemes
exports.getAllSchemes = async (req, res) => {
  try {
    const { isActive } = req.query;
    const where = isActive !== undefined ? { isActive: isActive === 'true' } : {};

    const schemes = await prisma.scheme.findMany({
      where,
      include: {
        hospitals: {
          include: { hospital: true }
        }
      }
    });

    res.json({ success: true, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get scheme by ID
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await prisma.scheme.findUnique({
      where: { id: req.params.id },
      include: {
        hospitals: {
          include: { hospital: true }
        }
      }
    });

    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found' });
    }

    res.json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create scheme
exports.createScheme = async (req, res) => {
  try {
    const scheme = await prisma.scheme.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update scheme
exports.updateScheme = async (req, res) => {
  try {
    const scheme = await prisma.scheme.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete scheme
exports.deleteScheme = async (req, res) => {
  try {
    await prisma.scheme.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get schemes by hospital
exports.getSchemesByHospital = async (req, res) => {
  try {
    const schemes = await prisma.hospitalScheme.findMany({
      where: { hospitalId: req.params.hospitalId },
      include: { scheme: true }
    });

    res.json({ success: true, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Enroll hospital in scheme
exports.enrollHospital = async (req, res) => {
  try {
    const { hospitalId, schemeId } = req.body;

    const enrollment = await prisma.hospitalScheme.create({
      data: {
        hospitalId,
        schemeId
      },
      include: {
        hospital: true,
        scheme: true
      }
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
