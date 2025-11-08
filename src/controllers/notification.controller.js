const { pool } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class NotificationController {
  async sendNotification(req, res, next) {
    try {
      const { patient_id, type, message, metadata } = req.body;

      // Simulate sending notification (log as alert)
      logger.info('NOTIFICATION ALERT', {
        correlationId: req.correlationId,
        patientId: patient_id,
        type,
        message,
        metadata
      });

      // Store in database
      const result = await pool.query(
        `INSERT INTO notifications (patient_id, type, message, metadata, status)
         VALUES ($1, $2, $3, $4, 'SENT') RETURNING *`,
        [patient_id, type, message, metadata ? JSON.stringify(metadata) : null]
      );

      res.status(201).json({ success: true, data: result.rows[0], correlationId: req.correlationId });
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const { patient_id, type, status, page = 1, limit = 10 } = req.query;
      const conditions = [];
      const values = [];
      let paramCount = 0;

      if (patient_id) {
        paramCount++;
        conditions.push(`patient_id = $${paramCount}`);
        values.push(patient_id);
      }

      if (type) {
        paramCount++;
        conditions.push(`type = $${paramCount}`);
        values.push(type);
      }

      if (status) {
        paramCount++;
        conditions.push(`status = $${paramCount}`);
        values.push(status);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const offset = (page - 1) * limit;

      const countResult = await pool.query(`SELECT COUNT(*) FROM notifications ${whereClause}`, values);
      const totalCount = parseInt(countResult.rows[0].count);

      const result = await pool.query(
        `SELECT * FROM notifications ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
        [...values, limit, offset]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: { page: parseInt(page), limit: parseInt(limit), totalCount, totalPages: Math.ceil(totalCount / limit) },
        correlationId: req.correlationId
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `UPDATE notifications SET status = 'READ', read_at = CURRENT_TIMESTAMP
         WHERE notification_id = $1 RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
      }

      res.json({ success: true, data: result.rows[0], correlationId: req.correlationId });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
