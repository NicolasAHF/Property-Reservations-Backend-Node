import { Router } from 'express';
import { getTopProblematicProperties } from '../services/rankingService';


const router = Router();


router.get('/sensor/ranking', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).send('Las fechas de inicio y fin son requeridas');
        }

        const start = new Date(startDate.toString());
        const end = new Date(endDate.toString());

        const ranking = await getTopProblematicProperties(start, end);

        res.json(ranking);
    } catch (error) {
        console.error('Error al obtener el ranking de inmuebles:', error);
        res.status(500).send('Error interno del servidor');
    }
});
  


export default router;