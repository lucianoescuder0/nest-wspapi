import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empresas } from "./empresas.entity";
import { Ubicaciones } from "./ubicaciones.entity";
import { Pedidos } from "./pedidos.entity";

@Entity()
export class Empleados {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  horaDesde: number;

  @Column()
  horaHasta: number;

  @ManyToOne(() => Empresas, empresa => empresa.empleados)
  empresa!: Empresas;

  @ManyToOne(() => Ubicaciones, ubicacion => ubicacion.empleados, { eager: true })
  ubicacion!: Ubicaciones;

  @ManyToOne(() => Pedidos, pedidos => pedidos.empelado)
  pedidos?: Pedidos[];

}