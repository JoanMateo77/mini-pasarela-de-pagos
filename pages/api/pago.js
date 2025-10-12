import helmet from "helmet";

let pagos=[];

//Simple tokenizador de tarjetas 

function tokenizarTarjeta(numeroTarjeta){
    return 'tok' +  Math.random().toString(36).substring(2, 14);
}
//helper para usar el helmet en next js  (helmet devovera el midelwqare)

function usarHelmet(req, res) {
  return new Promise((resolve) => {
    helmet()(req, res, () => resolve());
  });
}

export default async function handler(req, res){
    //usar la seguridad de helmet 
    await usarHelmet(req, res);

    if(req.method === 'POST'){
        const {tarjeta, monto, moneda, metodo } = req.body; 
          
        if (!tarjeta || !monto || !moneda) {
      return res.status(400).json({ error: 'Faltan datos requeridos: tarjeta, monto o moneda' });
    }
     //tokenizar la tajerta
       const tokenTarjeta = tokenizarTarjeta (tarjeta);

       const nuevoPago ={
            id: pagos.length + 1,
            monto,
            moneda,
            metodo: metodo || 'tarjeta',
            tokenTarjeta,
            estado: 'PENDIENTE',
            creadoEn: new Date().toISOString()
       };
       pagos.push(nuevoPago);

       return res.status(201).json({mensaje: 'pago recibido', data: nuevoPago});

    }
     if (req.method === 'GET') {
    // devolver todos los pagos (solo para testing)
    return res.status(200).json(pagos);
  }
   res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}