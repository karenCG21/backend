import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('losses')
export class Loss {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    date!: Date;

    @Column()
    reason!: string;

    // RELACIÓN CON PRODUCTO/PLANTA
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'plant_id' })
    plant!: Product;

    // RELACIÓN CON USUARIO
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}