## Clase

- 11x.xxx.x.x es clase C, desde todos 0s hasta todos 1s, es decir desde _255_ hasta _192_, e.g. desde 111.111.1.1 que es 255 a 110.000.0.0 que es 192
- 10x.xxx.x.x es clase B, desde _191_ a _128_, que es desde 101.111.1.1 hasta 100.000.0.0
- 01x.xxx.x.x es clase A, desde _127_ hasta _0_, desde 011.111.1.1 hasta 000.000.0.0

Traduciendo _192.168.0.1_ a binario: 1100 0000 - 1010 1000 - 0000 0000 - 0000 0001

| 192       | 168       | 0         | 1         |
| --------- | --------- | --------- | --------- |
| 1100 0000 | 1010 1000 | 0000 0000 | 0000 0001 |

Hacemos una división imaginaria en el último octeto, la parte izquierda se llamará _porción de red_. Porción de red se puede llamar como el nombre de la red, es el identificador de la red, es como tener los mismos apellidos en una familia. El nombre es el que puede variar en la familia, y no deberían haber dos con el mismo nombre, el nombre de la persona es el _último octeto_, se le llama _porción de dispositivo_.

#### Máscara de subred

11111111.11111111.11111111.00000000 <- máscara de subred de 24 bits, porque tiene 24 bits al frente de los disponibles, es máscara /24, es decir 24 1s seguido de cuantos 0s sean

Usando el mismo ejemplo de 192.168.0.1

|                                    | Porción de red                    | Porción de dispositivo |
| ---------------------------------- | --------------------------------- | ---------------------- |
|                                    | 1100 0000 - 1010 1000 - 0000 0000 | 0000 0001              |
| Máscara de red                     | 11111111 - 11111111 - 11111111    | 0000 0000              |
| _Dirección de red_ (operacion AND) | 1100 0000 - 1010 1000 - 0000 0000 | 0000 0000              |
| Dirección de _difusión_            | 1100 0000 - 1010 1000 - 0000 0000 | 1111 1111              |

La **dirección de red** serían como los apellidos de la familia, es el resultado de la _operación AND_ entre la _dirección IP_ y la _máscara de red_

La **dirección de difusión** es un comodín que identifica a todos en la red, esta dirección no la debe de tener nadie porque todos están obligados a recibir un mensaje pero no a contestar.

La dirección de difusión es agregarle todos 1s a la **porción de dispositivo** de la _dirección de red_.

![[Pasted image 20260224141649.png]]

Los modems tienen servicio de DHCP ya que cuando conectamos algo por ethernet, se envía un paquete de difusión buscando el servidor DHCP para que nos asignen una IP.

Ejemplo con _192.10.20.30_ obtener dirección de _red y difusión_:

1. Identificar la clase - C -> 24
2. Hacer operación AND entre IP y máscara

Dirección de red en decimal: 192.10.20.0 -> _No_ se pueden (o deben) usar
Dirección de difusión en decimal: 192.10.20.255 -> _No_ se pueden (o deben) usar

|                                  | Porción de red                    | Porción de dispositivo |
| -------------------------------- | --------------------------------- | ---------------------- |
|                                  | 1100 0000 - 0000 1010 - 0001 0100 | 0001 1110              |
| Máscara de red                   | 1111 1111 - 1111 1111 - 1111 1111 | 0000 0000              |
| Dirección de red (operacion AND) | 1100 0000 - 0000 1010 - 0001 0100 | 0000 0000              |
| Dirección de difusión            | 1100 0000 - 0000 1010 - 0001 0100 | 1111 1111              |

![[Pasted image 20260224143208.png]]

**Ejercicio para clase B**:

172.18.10.0 ¿Red y difusión?

Su máscara tiene _16 bits_

Pasos:

1. Identificar la clase: B -> 16 bits
2. Hacer operación AND IP y Máscara
   _IP original_ 172.18.10.1 -> 10101100 . 00010010 . 00001010 . 00000001
   _Máscara de red_ 255.255.0.0 -> 11111111 . 11111111 . 00000000 . 00000000
   _Operación AND (Dirección de red)_ -> 10101100 . 00010010 . 00000000 . 00000000
   _Dirección de difusión_ -> 10101100 . 00010010 . 11111111 . 11111111

![[Pasted image 20260225162521.png]]

140.20.36.10 ¿Red y difusión?

Pasos:

1. Identificar clase: "B" -> /16 - 255.255.0.0
2. Hacer operación AND entre IP y Máscara

|                                  | Porción de red        | Porción de dispositivo |
| -------------------------------- | --------------------- | ---------------------- |
|                                  | 1000 1100 - 0001 0100 | 0010 0100 - 0000 1010  |
| Máscara de red                   | 1111 1111 - 1111 1111 | 0000 0000 - 0000 0000  |
| Dirección de red (operacion AND) | 1000 1100 - 0001 0100 | 0000 0000 - 0000 0000  |
| Dirección de difusión            | 1000 1100 - 0001 0100 | 1111 1111 - 1111 1111  |

$$
\begin{aligned}
140.20.36.10 \\
255.255.0.0 \\
------------ \\
140.20.0.0 \, -> \, Red \\
140.20.255.255 \, -> \, Difusión
\end{aligned}
$$

**Ejemplo clase A**

38.40.101.125 ¿Red y difusión?

Pasos:

1. Identificar la clase
   "A" -> /8 - 255.0.0.0
2. Hacer AND a la IP y Máscara
   $$
\begin{aligned}
38.40.101.125 \\ 
255.0.0.0 \\
------------ \\
38.0.0.0 \, -> \, Red \\
38.255.255.255 \, -> \, Difusión 
\end{aligned}
$$

#### Ejercicio

|     | Dirección      | Clase | Dirección de red |
| --- | -------------- | ----- | ---------------- |
| a   | 192.168.10.1   | C     | _192.168.10.0_   |
| b   | 192.168.20.1   | C     | 192.168.20.0     |
| c   | 192.168.10.10  | C     | _192.168.10.0_   |
| d   | 192.168.10.110 | C     | _192.168.10.0_   |
| e   | 192.168.20.110 | C     | 192.168.20.0     |
| f   | 191.168.20.110 | B     | **191.168.0.0**  |

Red 192.168.10.0 - a, c y d

Red 192.168.20.0 - b y e

Red 191.168.0.0 - f

|     | Dirección     | Clase | Dirección de red |     |
| --- | ------------- | ----- | ---------------- | --- |
| a   | 190.168.10.10 | B     | 190.168.0.0      |     |
| b   | 191.168.20.10 | B     | 191.168.0.0      |     |
| c   | 192.168.1.2   | C     | 192.168.1.0      |     |
| d   | 190.169.10.22 | B     | 190.169.0.0      |     |
| e   | 191.168.20.22 | B     | 191.168.0.0      |     |
| f   | 192.169.1.2   | C     | 192.169.1.0      |     |
