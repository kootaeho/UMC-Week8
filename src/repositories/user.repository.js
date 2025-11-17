import { pool } from "../db.config.js";
import { ConflictError, DatabaseError } from "../errors/custom-errors.js";

export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
      data.email
    );

    if (confirm[0].isExistEmail) {
      throw new ConflictError("이미 존재하는 이메일입니다.");
    }

    const insertQueryBase = `INSERT INTO user (email, name, gender, birth, address, detail_address, phone_number`;
    const insertValuesBase = ` VALUES (?, ?, ?, ?, ?, ?, ?`;
    const params = [
      data.email,
      data.name,
      data.gender,
      data.birth,
      data.address,
      data.detailAddress,
      data.phoneNumber,
    ];

    let insertQuery = insertQueryBase + `)` + insertValuesBase + `);`;

    if (data.password) {
      insertQuery = `INSERT INTO user (email, name, gender, birth, address, detail_address, phone_number, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
      params.push(data.password);
    }

    const [result] = await pool.query(insertQuery, params);

    return result.insertId;
  } catch (err) {
    if (err instanceof ConflictError) {
      throw err;
    }
    throw new DatabaseError(`회원가입 중 데이터베이스 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE id = ?;`, userId);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user;
  } catch (err) {
    throw new DatabaseError(`사용자 조회 중 데이터베이스 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

export const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO user_favor_category (food_category_id, user_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );

    return;
  } catch (err) {
    throw new DatabaseError(`선호 카테고리 설정 중 데이터베이스 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      "SELECT ufc.id, ufc.food_category_id, ufc.user_id, fcl.name " +
        "FROM user_favor_category ufc JOIN food_category fcl on ufc.food_category_id = fcl.id " +
        "WHERE ufc.user_id = ? ORDER BY ufc.food_category_id ASC;",
      userId
    );

    return preferences;
  } catch (err) {
    throw new DatabaseError(`선호 카테고리 조회 중 데이터베이스 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};
