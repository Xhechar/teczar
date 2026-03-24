import { ModelType, SocketTypes } from "../enums/enums";

export const ModelSocketMap: Record<ModelType, SocketTypes[]> = {
  [ModelType.User]: [SocketTypes.usc, SocketTypes.usu, SocketTypes.usd],

  [ModelType.Advert]: [SocketTypes.adc, SocketTypes.adu, SocketTypes.add],

  [ModelType.JobApplication]: [
    SocketTypes.jac,
    SocketTypes.jau,
    SocketTypes.jad,
  ],

  [ModelType.Job]: [SocketTypes.joc, SocketTypes.jou, SocketTypes.jod],

  [ModelType.Review]: [SocketTypes.rec, SocketTypes.reu, SocketTypes.red],

  [ModelType.Payment]: [SocketTypes.pac, SocketTypes.pau, SocketTypes.pad],

  [ModelType.OrderItem]: [SocketTypes.oic, SocketTypes.oiu, SocketTypes.oid],

  [ModelType.Order]: [SocketTypes.orc, SocketTypes.oru, SocketTypes.ord],

  [ModelType.CartItem]: [SocketTypes.cic, SocketTypes.ciu, SocketTypes.cid],

  [ModelType.Cart]: [SocketTypes.cac, SocketTypes.cau, SocketTypes.cad],

  [ModelType.Category]: [SocketTypes.cgc, SocketTypes.cgu, SocketTypes.cgd],

  [ModelType.ServiceRequest]: [
    SocketTypes.src,
    SocketTypes.sru,
    SocketTypes.srd,
  ],

  [ModelType.Service]: [SocketTypes.sec, SocketTypes.seu, SocketTypes.sed],

  [ModelType.ProductImage]: [SocketTypes.pic, SocketTypes.piu, SocketTypes.pid],

  [ModelType.Product]: [SocketTypes.prc, SocketTypes.pru, SocketTypes.prd],
  [ModelType.HeroSlide]: [SocketTypes.hsc, SocketTypes.hsu, SocketTypes.hsd],
};
