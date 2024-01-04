import { Request, Response } from "express"
import AppDataSource from "@/database/connections"
import { Product } from "@/entities/product.entity"
import { create } from "domain"
import { request } from "http"
import { Repository } from "typeorm"
import { promises } from "dns"
import { validate } from "class-validator"
import { productRepository } from "@/repositories/product.repository"
import { CreateProductDTO } from "@/dto/product.dto"
import { UpdateProductDTO } from "@/dto/product.dto"
import { dot } from "node:test/reporters"

class ProductController {
  private productRepository: productRepository

  constructor() {
    this.productRepository = new productRepository
  }


  findAll = async (request: Request, response: Response): Promise<Response> => {
    const products = await this.productRepository.getAll()

    return response.status(200).send({
      data: products
    })
  }

  create = async (request: Request, response: Response): Promise<Response> => {
    const { name, description, weight } = request.body;

    const createProductDTO = new CreateProductDTO
    createProductDTO.name = name;
    createProductDTO.description = description;
    createProductDTO.weight = weight;

    const errors = await validate(createProductDTO)
    if(errors.length > 0){
      return response.status(422).send({
        errors: errors
      })
    }

    const productDb = await this.productRepository.create(createProductDTO)

    return response.status(201).send({
      data: productDb
    })
  }

  findOne = async(request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id
    const product = await this.productRepository.find(id);

    if (!product) {
      return response.status(404).send({
        error: 'Produto não cadastrado!'
      })
    }

    return response.status(200).send({
      data: product
    })

  }

  update = async(request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id
    const { name, description, weight } = request.body;

    let product = await this.productRepository.find(id);
    if(!product){
        return response.status(404).send({
          Error: 'Código do produto não encontrado!'
        })
    }

    const updateDTO =  new UpdateProductDTO
    updateDTO.id = id
    updateDTO.name = name
    updateDTO.description = description
    updateDTO.weight = weight

    //Validação dos campos
    let errors = await validate(product);
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    try {
     const productDb = await this.productRepository.update(updateDTO);
     if(!productDb){
        return response.status(404).send({
        error: 'Produto não encotrado!'
      })
     }
     return response.status(200).send({
        data: productDb
     })
  }catch (error) {
      return response.status(500).send({
        error: 'Produto não existente!'
      })
    }
  }

  delete = async(request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id;

    try {
      await this.productRepository.delete(id);
      return response.status(204).send({});

    } catch (error) {
      return response.status(400).send({});
      error: 'Error deleting'
    }
  }
}
export default new ProductController