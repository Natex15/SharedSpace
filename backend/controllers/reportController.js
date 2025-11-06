import Report from '../models/reportModel.js';
import Artwork from '../models/artworkModel.js';

// create report
export const createReport = async (req, res) => {
  try {
    const { artworkID, reason } = req.body;

    if (!artworkID || !reason) {
      return res.status(400).json({ message: 'artworkID and reason are required' });
    }

    const report = new Report({
      artworkID,
      reporterID: req.user.userId,
      reason
    });

    await report.save();

    // Increment report count of artwork
    await Artwork.findByIdAndUpdate(artworkID, { $inc: { reportCount: 1 } });

    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Unable to create report', error: error.message });
  }
};

// get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
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
// maiincrement lang report ng artwork kapag na update na
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
