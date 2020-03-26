import * as Yup from 'yup';
import connection from '../../database/index';

class IncidentsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select(
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
      );

    res.header('X-Total-Count', count.count);

    return res.json(incidents);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const { title, description, value } = req.body;
    const ong_id = req.ongId;

    await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });

    return res.json({ title, description, value, ong_id });
  }

  async delete(req, res) {
    const { id } = req.params;
    const ong_id = req.ongId;

    const [incidentsExists] = await connection('incidents').where('id', id);

    if (!incidentsExists) {
      return res.status(401).json({ error: 'Incidents does not exists' });
    }

    if (incidentsExists.ong_id !== ong_id) {
      return res.status(401).json({ error: 'Operation not permitted' });
    }

    await connection('incidents').where('id', id).delete();

    return res.status(204).send();
  }
}

export default new IncidentsController();
