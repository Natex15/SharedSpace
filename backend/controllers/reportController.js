import Report from '../models/reportModel.js';
import Artwork from '../models/artworkModel.js';
import { sendNotification } from '../utils/notificationHelper.js';

// create report
export const createReport = async (req, res) => {
  try {
    const { artworkID, reason } = req.body;

    if (!artworkID || !reason) {
      return res.status(400).json({ message: 'artworkID and reason are required' });
    }

    // fetch artwork
    const artwork = await Artwork.findById(artworkID);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // create and save the report
    const report = new Report({
      artworkID,
      reporterID: req.user.userId,
      reason
    });
    await report.save();

    // increment the report count
    artwork.reportCount = (artwork.reportCount || 0) + 1;
    await artwork.save();

    await sendNotification(
      artwork.ownerID,
      'report_update', 
      'Content Flagged', 
      `Your artwork "${artwork.title}" has been flagged for a community review.`
    );

    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Unable to create report', error: error.message });
  }
};

// get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
    .populate('artworkID', 'title imageURL')
    .populate('reporterID', 'username');
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get one report
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update report status
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReport) return res.status(404).json({ message: 'Report not found' });

    if (status === 'resolved') {
        // Notify the reporter that action was taken
        await sendNotification(
          updatedReport.reporterID,
          'system_alert',
          'Report Resolved',
          'Thank you! The content you reported has been reviewed and handled.'
        );
    }
    res.json({ message: 'Report status updated', report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
