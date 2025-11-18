import prisma from './db';

export const HospitalValidationService = {
  // Save OCR results and create provider record
  async saveOCRResults(data) {
    try {
      // First save the raw OCR data
      const rawData = await prisma.rawScrapedData.create({
        data: {
          sourceUrl: 'OCR_SCAN',
          rawJson: data.rawData
        }
      });

      // Create or update provider record
      const provider = await prisma.provider.upsert({
        where: {
          npi: data.parsedInfo.licenseNumber || 'UNKNOWN'
        },
        update: {
          firstName: data.parsedInfo.hospitalName.split(' ')[0] || 'Unknown',
          lastName: data.parsedInfo.hospitalName.split(' ').slice(1).join(' ') || 'Provider',
          overallTrustScore: 0.7, // Initial trust score
          lastVerifiedAt: new Date(),
        },
        create: {
          firstName: data.parsedInfo.hospitalName.split(' ')[0] || 'Unknown',
          lastName: data.parsedInfo.hospitalName.split(' ').slice(1).join(' ') || 'Provider',
          npi: data.parsedInfo.licenseNumber || 'UNKNOWN',
          overallTrustScore: 0.7,
          status: 'UNDER_REVIEW'
        }
      });

      // Add location if address exists
      if (data.parsedInfo.address) {
        await prisma.location.create({
          data: {
            providerId: provider.id,
            addressLine1: data.parsedInfo.address,
            city: 'Unknown', // You might want to parse the address further
            state: 'Unknown',
            zip: 'Unknown',
            isPrimary: true
          }
        });
      }

      // Add credential if license number exists
      if (data.parsedInfo.licenseNumber) {
        await prisma.credential.create({
          data: {
            providerId: provider.id,
            type: 'MEDICAL_LICENSE',
            number: data.parsedInfo.licenseNumber,
            expirationDate: data.parsedInfo.validUntil ? new Date(data.parsedInfo.validUntil) : null
          }
        });
      }

      return { success: true, provider };
    } catch (error) {
      console.error('Error saving OCR results:', error);
      return { success: false, error: error.message };
    }
  },

  // Get validation results for a provider
  async getValidationResults(providerId) {
    try {
      const results = await prisma.discrepancyLog.findMany({
        where: {
          providerId
        },
        include: {
          provider: true
        }
      });
      return { success: true, results };
    } catch (error) {
      console.error('Error getting validation results:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all providers
  async getAllProviders() {
    try {
      const providers = await prisma.provider.findMany({
        include: {
          locations: true,
          credentials: true,
          discrepancyLogs: true
        }
      });
      return { success: true, providers };
    } catch (error) {
      console.error('Error getting providers:', error);
      return { success: false, error: error.message };
    }
  }
};