import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Empresas } from "./empresas.entity";
import { Empleados } from "./empleados.entity";

@Entity()
export class Ubicaciones {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: String, nullable: false })
  ciudad!: string;

  @Column({ type: String, nullable: false })
  calle!: string;

  @Column({ type: Number, nullable: true })
  numero?: number;

  @Column({ type: String, nullable: true })
  edificio?: string;

  @Column({ type: String, nullable: true })
  piso?: string;

  @ManyToOne(() => Empresas, empresa => empresa.ubicaciones)
  empresa!: Empresas;

  @OneToMany(() => Empleados, empleados => empleados.ubicacion)
  empleados?: Empleados[];
}