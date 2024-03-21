import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Empleados } from "./empleados.entity";

@Entity()
export class Pedidos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: false })
  nombre: string;

  @Column({ type: String, nullable: false })
  apellido: string;

  @Column({ type: String, nullable: false })
  telefono: string;

  //true = abierta, false = cerrado
  @Column({ type: Boolean, nullable: false, default: true })
  estado: boolean;

  @Column({ type: String, nullable: false })
  lugar: string;

  @OneToMany(() => Empleados, empleado => empleado.pedidos, { eager: true })
  empelado!: Empleados;

}