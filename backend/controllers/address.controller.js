const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jaccardService = require('../services/jaccard.service');

// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      include: { hospital: true }
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id: req.params.id },
      include: { hospital: true }
    });

    if (!address) {
      return res.status(404).json({ success: false, error: 'Address not found' });
    }

    res.json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create address
exports.createAddress = async (req, res) => {
  try {
    const address = await prisma.address.create({
      data: req.body,
      include: { hospital: true }
    });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: req.body,
      include: { hospital: true }
    });
    res.json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    await prisma.address.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get addresses by hospital
exports.getAddressesByHospital = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { hospitalId: req.params.hospitalId },
      include: { hospital: true }
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Validate address using Jaccard similarity
exports.validateAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, error: 'Address is required' });
    }

    // Get all reference addresses from database
    const referenceAddresses = await prisma.referenceAddress.findMany({
      where: { isActive: true }
    });

    // Calculate similarity with each reference address
    const matches = referenceAddresses.map(refAddr => {
      const fullRefAddress = `${refAddr.addressLine1} ${refAddr.addressLine2 || ''} ${refAddr.city} ${refAddr.state} ${refAddr.pincode}`.trim();
      const score = jaccardService.calculateSimilarity(address, fullRefAddress);
      
      return {
        referenceAddress: refAddr,
        similarity: score,
        isMatch: score >= 0.6
      };
    });

    // Sort by similarity score
    matches.sort((a, b) => b.similarity - a.similarity);

    // Return top 5 matches
    const topMatches = matches.slice(0, 5);

    res.json({
      success: true,
      data: {
        inputAddress: address,
        matches: topMatches,
        bestMatch: topMatches[0] || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Bulk validate addresses
exports.bulkValidateAddresses = async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ success: false, error: 'Addresses array is required' });
    }

    const referenceAddresses = await prisma.referenceAddress.findMany({
      where: { isActive: true }
    });

    const results = addresses.map(addr => {
      const matches = referenceAddresses.map(refAddr => {
        const fullRefAddress = `${refAddr.addressLine1} ${refAddr.addressLine2 || ''} ${refAddr.city} ${refAddr.state} ${refAddr.pincode}`.trim();
        return {
          referenceAddress: refAddr,
          similarity: jaccardService.calculateSimilarity(addr, fullRefAddress)
        };
      });

      matches.sort((a, b) => b.similarity - a.similarity);
      const bestMatch = matches[0];

      return {
        inputAddress: addr,
        bestMatch: bestMatch ? bestMatch.referenceAddress : null,
        similarity: bestMatch ? bestMatch.similarity : 0,
        isValid: bestMatch && bestMatch.similarity >= 0.6
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
