import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publicidad')
export class OrmPromotionEntity {
  @PrimaryGeneratedColumn('uuid')
  codigo_publicidad: string;

  @Column()
  url_publicidad: string;

  @Column()
  referencia_imagen: string;

  static create(
    id: string,
    url: string,
    imageRef: string
  ): OrmPromotionEntity {
    const promotion = new OrmPromotionEntity();
    promotion.codigo_publicidad = id;
    promotion.url_publicidad = url;
    promotion.referencia_imagen = imageRef;
    return promotion;
  }
}
