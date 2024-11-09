import { Router } from 'express';
import { Assignment } from '../models/assignment';

const router = Router();


router.post('/assignments', async (req, res) => {
    const assignment = new Assignment(req.body);
    try {
      await assignment.save();
      res.status(201).send(assignment);
    } catch (error) {
      res.status(400).send(error);
    }
});

router.get('/assignments', async (req, res) => {
    try {
      const assignments = await Assignment.find();
      res.send(assignments);
    } catch (error) {
      res.status(500).send(error);
    }
});
  
router.get('/assignments/:propertyId', async (req, res) => {
    try {
      const assignments = await Assignment.find({ propertyId: req.params.propertyId });
      if (!assignments.length) {
        return res.status(404).send();
      }
      res.send(assignments);
    } catch (error) {
      res.status(500).send(error);
    }
});


export default router;