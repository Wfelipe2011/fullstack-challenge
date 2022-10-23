import { Address } from "../domain/Address";
import { ClientOrder } from "../domain/ClientOrder";
import { OrderCreateDto, OrderSaveDto } from "../dto/OrderCreateDto";
import { AddressRepository } from "../interfaces/AddressRepository";
import { ClientRepository } from "../interfaces/ClientRepository";
import { TablePaginateResponse } from "../interfaces/TablePaginateResponse";

export class OrderService {

    constructor(private clientRepository: ClientRepository, readonly addressRepository: AddressRepository) { }

    async save(order: OrderCreateDto): Promise<OrderSaveDto> {
        try {
            const orderEntity = await this.clientRepository.save(new ClientOrder({
                name: order.name,
                productWeight: order.productWeight,
            }));
            const addressEntity = await this.addressRepository.save(new Address({
                ...order.address,
                clientOrderId: orderEntity.id
            }));
            return {
                ...orderEntity,
                address: addressEntity
            }
        } catch (error) {
            throw new Error("Erro ao salvar cliente");
        }
    }

    async findAll(page: number, per_page: number = 5): Promise<TablePaginateResponse<ClientOrder>> {
        try {
            return await this.clientRepository.findAll(page, per_page);
        } catch (error) {
            throw new Error("Erro ao buscar clientes");
        }
    }

    async findById(id: string): Promise<ClientOrder | undefined> {
        try {
            return await this.clientRepository.findById(id);
        } catch (error: any) {
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.clientRepository.delete(id);
        } catch (error) {
            throw new Error("Erro ao deletar cliente");
        }
    }

    async deleteAll(): Promise<void> {
        try {
            await this.clientRepository.deleteAll();
        } catch (error) {
            throw new Error("Erro ao deletar todos os clientes");
        }
    }
}