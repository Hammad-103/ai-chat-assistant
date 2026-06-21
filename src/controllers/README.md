# Controllers

Request handlers that process incoming HTTP requests and coordinate with services.

Example structure:
```
const controller = {
  getResource: async (req, res, next) => {
    try {
      const data = await service.fetch();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
};
```
