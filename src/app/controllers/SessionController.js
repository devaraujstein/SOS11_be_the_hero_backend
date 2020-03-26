import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import connection from '../../database/index';

class SessionController {
  async store(req, res) {
    const { ong_id } = req.body;

    const schema = Yup.object().shape({
      ong_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const [ong] = await connection('ongs').where('id', ong_id);

    if (!ong) {
      return res.status(401).json({ error: 'Ong does not exists' });
    }

    const { id, name, email, whatsapp, city, uf } = ong;

    return res.json({
      ong: {
        id,
        name,
        email,
        whatsapp,
        city,
        uf,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
