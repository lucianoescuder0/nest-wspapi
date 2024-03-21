import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Empleados } from "./empleados.entity";
import { Ubicaciones } from "./ubicaciones.entity";

@Entity()
export class Empresas {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: String, nullable: false })
  nombre: string;

  @OneToMany(() => Empleados, empleado => empleado.empresa, {eager: true})
  empleados?: Empleados[];

  @OneToMany(() => Ubicaciones, ubicacion => ubicacion.empresa, {eager: true})
  ubicaciones?: Ubicaciones[];
}