
import express, {Request, Response, Router} from "express";
import productController from "@/controllers/product.controller";

const routes = Router()
routes.post('/api/products', productController.create);
routes.get('/api/products', productController.findAll);
routes.get('/api/products/:id', productController.findOne);
routes.put('/api/products/:id', productController.update);
routes.delete('/api/products/:id', productController.delete);
routes.get('/', (request, response) => {
  response.status(200).send({
    success: true
  });
})

routes.get("*", (_: Request, response:Response)=>{
  response.status(404).send({
    error: "Página não encontrada!"
  })
})

export default routes

