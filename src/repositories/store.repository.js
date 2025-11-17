import { pool } from "../db.config.js";
import { DatabaseError } from "../errors/custom-errors.js";

export const addStore = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query(
      `INSERT INTO store (name) VALUES (?);`,
      [data.store_name]
    );

    return result.insertId;
  } catch (err) {
    throw new DatabaseError(`가게 추가 중 데이터베이스 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

export const getStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query(`SELECT * FROM store WHERE id = ?;`, [storeId]);
    if (!rows || rows.length === 0) return null;
    return rows[0];
  } catch (err) {
    throw new DatabaseError(`가게 조회 중 데이터베이스 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};
