import React, { useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain } = React.useContext(CaptainDataContext);
  return (
    <div>
      <div className="h-1/2 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 h-full flex flex-col justify-between">
          {/* Captain Profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhMVFhUVGBUVFxgWFRYVFRUYFRcXFxUVFRUYHSggGB0lGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0dHSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK//AABEIAQUAwQMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xAA/EAABAwIDBQUFBwIGAgMAAAABAAIRAyEEEjEFQVFhcQYTIoGRMqGxwfAHQlJiktHhFHIVIzNDgvGisiRjc//EABgBAAMBAQAAAAAAAAAAAAAAAAABAgME/8QAIBEBAQACAwEBAQADAAAAAAAAAAECEQMhMRJRQRMyYf/aAAwDAQACEQMRAD8AzMIQlwjhCTYalNalQlAIBym1S6QUempVNTVRKoqdSUOiFNpNWVaRKpKSE1RpfUKQ4NAu4dNT6BSsAUJUY4+mLzI4yALcykf4rSmJZwtVDvcAjsaSiUbSo9bEhuotxzCTzA/lJw+0aTiGh4DjoDYnpOvlKQ0nNTrUzMJ1qkHmp1qaanWoMtAIkYQCkaJGmBhGiRpENBBBMnImpUI2sSsq6tsrgRCUAgAlgI2mwpilUlGY1XuzsCBD3iwiBxJ0lTTxhvC0XO0BVg1mWxuR90fM7lIFUU2EmBa0C5t8Oaz2L2y0yymM0e0RpOkOfp5DX45+tpNLPE4skZQ7Ize5uruIbvVZVr/cacrJkgQXu4Fx0B4RPxUOo97rucCYs0WpsHB7tXH8ttN2iH9IZGYd4TuNqY4CPZJ9SjR7SHsLvEWwDoXEFx4wXER5J6lgXe0M54GH+ofF0l1Qg+JwbuAi4/tZr7go+IxTSRFV4dxLg2b674T0NkYygWuBhxJ5wfWoYUepWflILLcH0mvA6FjiVMArEeGqD1EzyuJPuUTE0ybPY0nix4Y+fgT5nRPRbT9l9onRkcG1DpHimN1neLldXOy9sB5LN4uA4jMRwBBuRzusP3sGz3sP58jh6iAUDXfmB70S28g3HCRpu4qbjsbdSw9drxIP8KS1ZDZe2mmHzOaWuIAu5v3oBtqD5la2i+QHDQiVnZozqNEjSMoIwiCNMDCNEEaCBBBBGicrCNHCIrfbXLEgowUlxSQ66phliv8AYlG8vAiDBNteHyPP0kYzHghzTAzHU2ALS7wuO7XXdZZbGOYLipBuNCAbm5IHzUehi6z5DYeOIBAjm4wDu0kqRJI1GKqtfAqNzA2MyJvE5hIdYqvr1qYGVobbQZtBpHAcIA9bqNhKMHxNaQbFtxzJt06qwo1KDQWspRmJJgmTPEm/FI5KraVYPOVrHE7y3TzdIJ8ynDXcCAASJgl2Vo13BgBvzJ0lW1TI1pgFoO4AAH3nnqm6GFNQgGOQGgGpJ47vcpucjScdqlJebuIjXwt1B3GbRreCrLAseRIAY0QZHhzZhYHhvnkCrHFYemHZRoBeOItv6Kr2jinhoDQA0fdGh4knedPREy/ReP8AE3ICPbMD2uJ+jFhxA32YxWCoPaPC7MOViOBOYA/yoWHdLspMAhxdAg5YMRzET5pHclrg6bg5SCZaTu15qto+RVsIIluaN9pv7/gqnHYCqZ4CTeDoLaNWqbSpkh7bB2reE6+ny5hWOEwzSMuUHcOM7j1sjY0wvZl1QPdnaZke1vi/yC6psKe4ZOoCzeKwjCM7R/dytf3LRbGxALA3ePq3JTl2FmEpJCNZKKCNEEaZFIIIJAEaJBUTl4CMtTwaEeVax15IFQJkG6lV2qM0eIDmqc2apxOI72uWg2GoG+IGsWvv6q9ZVYwCD0neeJJPz+apA1tKq+LlxmToJNhe+qmUaxe4tEkNgEm0uO4DcPXckhKfVMGLt3kaRy5ck7snMJcR/I1txV7g9jy0SNyeZhQLRH1uWGddPFj1tWue9zpDekn5BW+BwmVupBNza58/2SKFGDPrv96tmgOGn1vWf02mKsxDRfl5KsxVMZYPEn+FfOwpDjwPWyYrYafPlxRsaYqvWyyBYgFvkZP11R/1hdE77EfBT9tbDe72GlV2D2ZVYIcDJOvreN2quZ9M/wDHql0MSWlzdwM9d3yC0uxsZJB+vCJ+UeazlfBuAJAnWeYTmzMUWm82tHWVUy2nLDTRYitlc4bjx3R9FMYHF5SIEO1EcP8AvySKTs4k9el7fNUnehjjJIvYkQAeRm609YWarpmCxIqNDh/0eCkBYrYe2msdOaWOgO/Kfxa6cfJbZpm6zsA0oIglBIAgjQQQkaCCYc0BSiUyEa1jpypusVGY0ZxNhIkp6qmGjxawqc+SHjsNnrmB4QZdeQ0CwBItPXitDsPZzfC/W5d1LgA0no0H9R4KicS+s6mB4QQD113bo+C1eAqBoE2EDlbf66eXNJH9Xj3BrY4+/wCvq6Zaybwq44gvdylWmGc1kTcrlyu67sZ84nqdDl+yk02hoiyrcRtyk0wXH/iJ8oGvWyq8T2kaCQ1rjFp009UvlX00+fmk1AL9OqzWE21mUt2Jc4SNQkfqzcALckxUosMT8lQ4zb+S0XTFLb9R3+yL7yYT+SuS9rYFpFlnMfs0gyArqltAujwxOomRfgQmK2Kvlda/nwRrRfW+qj4Q+ENIgxbyGnRZntFQ/wA3cCTAkxcaXkaiPetTvB4Ee4rP9sKIJFrTlke4281txVz8076QdkVD4iSGlurYP1xGq6zsJwOHpQSRlETr08tFyfY5cHgOAINpi5Eb9y6n2bp5aDBuIzCYMBxmLdVWbKLUBGEQSlmBoFBBMBCCEIIDmIajITgaicFptrai1Am8sGVJc1JyKtssme2kX0qjnAmKhaZ8gD7wrbZ+NNXwzcw6OOUtPwEKTisvdlj6ecOIFvaHCFGwfZv/ADgSXFgBO8cJCm5TuKmFkmTUUGwJIUDHY4uYXWDASJcYkixDWgGbyLxomjsihJHdBxJmfE4jyOaOkBMYPZoJDHjLTpF4iQA0l5cBA/K5p81jJHRdqurtxzDLYvvyxpzlyQNpuIzT+prdeWi0mKfRbpldwylrvdBhQm15MNpTPEAD3K9468L5y3vaBhcU0VGmplYHXBJhpuBvOt+J1W1Zj8M0Ca1Fp4mo0dd9llNpYJ5qUbxlDy4AWJdlA9Id6rWYLD+G0aXiyzz00w3qsTtDEh9Yik5rgJJe0yNdAdE2MNUcCcrnkaZs0Hd7M39FY1MA5uLztJvIPAiHQeocR5EqXUZWbcAHkd6uWaRZd2VQYPDVw85qFumU+Rsp81A1wJfLQXNkk6CcpBkAGIkKeMfUbY0TPJso8XhH1Wl4a5rg0huYZQSRYGRETwMouUpTDU/UOntGoQD/AE9QTvc+kPcHEqBtI1XVQHQA5kgAzYGZMxeARCuq7Mlg7TkAbfm3pnEAPLAdQDB3W+V0ceSeXHzZrYGFzuawmY16b9envXS6TQLDRZfsxs+HOeLbrHz+a1bU7dsbNUpGESNIhoIIIAIIIIDnKIhOhqPIqVswWosikZUMiNppzZ7RwnxNA38STHkpLq8lxbMHw9A2Z95TOCaM0b7x1j+U5SkNcIgtgX33Jn3qLe3RjjLhNG8KA4+LTWJMHqdY5KwptnRoAOsjXnA+d1V0nw7z92p+CsqeLaN/KNyxt7dGM3C37Mo3cWNB5T+6apgaNa0Adf3RYjGCLqmr7YBORk8yNAOqqXZ/KyeyX3Igaab+iutnUSAZ4Ksw4wwFnAvEHWSrZm02BuqAosZRh17Gbc1PozF580xido0i+X5QADJ/7VNtHapa6aJLmbxu8kCz9adgHP1lQceSIIsOG70UDA7aDxM+RsnsZjQQpyqpjpV450/Xr9dOCZr0iGtePuuHoR9eqWXDNHGD56H5Kdh6bHZqbiBJnXhB/ZVj4ys3k0PZm9MuO8/AQrsKm2MQJaPZtFo1AVwCtI5M/wDalBKSAlJoGhKJBAHKCJBAYMI00HpWdMFoJvOiNRAOsfBBVrtGoMuRol1r/GVRl6exO1w1hnWNVOfjfgvekfaVhbTLPrKgOxUnNJtu3XUnv+8pMePvNHwVVXpzHmstduiX8Crin1TkZYbzw5K32ZgmgQPPmVWuw7qbIbeL295UfBdpaQsXX4Qqk/E5Z99rLaWxod3jbOFwQq6ttGoLGbcAVPdt5hGjvMWhR34yibuBnoqOb/TeHwrqxBcPDzV83ChrYgaQqiltQN9lhIF9Ezj+0zGTma4fX8o7vSbde09jcLHiYcruG5yZo4yRGhGoO5M4OucRcBzW2IJtbkplXDht95j3KclY5UKDtOchWWFcwkkwSD8lV0IlvX4q/wBhdloea1V5dndnyRAHAHjuRJtOXJMfWg2Pgx/qEGSBEkxAFjl3WhWwSGpStyW7uykYSQlJkNBEggDQRII0HOQ9HnSEFei2XnRF6SiRobGXJOtuNkIRs1RobN9yKdMMboJAHAEzHQSmS2dN/wAQrephM9N2WC4XtrbUeio2VL3WWePbq4s946WFCuLApOO2BRqXc0Tuc2xH7qEal7K7w9XwxuUS2NeqYp7KeB4HUzYAZ28OhCkPoVyQTToCObjuhR8SSNPcobqz+JPqq2PnH8WlTB4hxOY0WAiPC3T1lVtfYVEvzP8A8x9on2RG/LpuR0y88VMw7YTuQ+cf5CcQAwD69FV1auYk6DRSNp1jxVa9+5RoWpFAlzgG6kwOq6Bsxrm02NeZcGtBI3kC6zHZnAtjvXCXT4eAjf1mfRaim5ayajk5Mt1PY5OAqKxyda5GkHkoFNByUHIBxBN5kMyYLQTeZGgnPsqGVP8Ado+7WiUfKhlUjukO6QEbKgGqT3Sq9v4/uWeETUdZo1M6adbJybJfU5o4GtiW697TpdGmC/1DgFncfh4cQONl1HE9mMmyDg9agpFzj+KqfG8/qJ8gFz3agEzF9Pr63qOWasdPD3ipRU1Wi2M8OaAeiz1anGidwuJLNFjcdtZlprjhWTEpTMLSH0Fnqe1uacdtPeSp01+ou30ae5R6haBZUz9qDqolfaZNgnorlCNpYgF5jcmadPjqkUmS6SpmHYXOAAkkgRxmwCtm1eAblY1vAD9z7yp9Nyg0+WikUytNOPacxyea9Q2OTzXJBKD0YemA5GHI0D+dDMmc6GdAPZkSazoICh7hH3CsO6R90tEq8UEO4Vj3STUaGgucQALknQBIKzEBrGl7jAGqwr8b3uOoOPs9/RgcAKjSpnaTbXfOhsim3T835is532V7H/he136XA/Ja446Ta9UPfv3b/Ncm7YYA0azm/dcczTxB58tPJdSwz81Np4gH1CqO02xhiaWWwe2Sw8/wnkUuXD6jbhz+b345BVFlGIUzF0XMcQ5sEGCDaCLRCjuXLHVYiVKW8JvuzxU0tTRBVJ0YFIp2lSTgapDG2SBNKnAVz2Mw3eYyjY2dnPRlx7wFVPE2W6+znZ2UPrka+BvP8RHuHqnhN5DK6xtZnsxjxUNWjN6VSo1vNge4N9Ij0Wha1cyqVX4bH4gNMZa9YeXeOj3ELb7L7RU3iKnhd7jz5LfLH+uKVdtanWhIo1GuEtII5GU7CjR7ElBFCNLQ2NBCEEaGwRI4QRobFlQdAEkwOJWdx3a1rRFNuZ3E6Dy3rKbS21VqnxuJ5D2R5LSYVO2w2l2opU7U/G70b671k9sbdqVRD3QPwtsP5VSKxUeqSrmMhbCo+VExFwnXJuoLJk9Edg9sNrYGg6b5Gtd/c0ZXe8K6fUB0XJfse2n4alAn2XZh0dr7wV1FpVKii7V9nW4kZ6cNrAan2Xjg75HcuZYik5jix7Sx7dWkX/kc12mtESqHbWzqOJblqiHD2Xizm+e8cjZY8nHvuOnj5NdXxzEpDgrPbOxa2Gu8Zqe6o32f+Q+6fqVX0zK59Wet/e4DWpyOCPImiXFwYxpc9xhrRqSdAlTkT9k4F1eq2kzV1yfwt3uP1vXWsJQbTY2mwQ1oAVP2V2IMLS8UOrPg1CNx/COQV5MAk7gSuniw+Z/1y83J9Xrx567WvB2liz/9zvdAQw9XmqitiTUrVKrtalR7z/ycXfNTKL1o51vRxb2GWuLTyKvMB2vqMtWaHjiLH9isw2rZNuq5eYKLNjbqGz9u4et7LwDwdY/yrQBcdF7tKsNn7fr0fZeY4G49CouH4e3UoRwsps/tq0wKrI5t/ZaTBbRo1fYeDy0PoVFlh7PwgncqCQcYqVNVHc/6+uqSXWTbnWW6DtMpLnhInkkElAG4pKSXIIC47EbQNDGNO58tPxHwK7rhcYHAFecKdcsqNqD7jmu/SZjzXoPZtMOptqMu1zQ4HkRITiot2uBQfg2lQmPIKnUKyakSpgCNNDqDcHyWf2h2Lpvl1KKT+H+2fL7vl6Lbtuq/tBtFuGpZoDqjrU28XcTyGpU5Yy+rxysvTm1Ts/WD+7caVMyGgvqNgk/hAufQLZdnOyzMLLpz1XavIiB+Fg+6PiuaY7YjKxc+uXGo52czmHeTeZBgCeHBa3s72qqYaqzC4z/RdDadVzsz2O3MqHeNLm43rPDDGVrnnlY3gpwoW0a4ax3Q/BWFcxos9tvDOfTcBvBHqtnO8+5cr3Dn8U+wQntvYfu8S9nCPgE0CpRUii8pyZEEKI0qRIQRAlpToqgpBv1SNCgHg6E9RxJBsYKioF2/ggLj/G6v43fqKCp+95BBMGnmyJwuifuQ3pAHJBS4QPRANpDinXN5JDRP170AnIu4fZDtAVcE2mdaTnU/L2m/+LgPJcT5LdfY7tLu8W+gTaq3M3+6n+7Sf0pw47RWwIKhnCFpVtTqJZdO5NatbVDWlzzla0EuJsABcklczxHaFuMrOqy9tyymCIaKcwCZ3u1PpuuX2vdqy4nAUD4RHfuG8i4pdBqfIcVitiY2r3kQxwy5AHaDfmAPUz1UZX+NMZrtt3Uy10gCqXWyubmNt7Q06a87blku1t2ZXPcQB7JmzvwwehCvm7fw8ONNzy+kJcWtd4I9ouN5ETbVVWJwRr1C4zl1k2JmSbeilTb/AGW9pf6iiMNWJ72kIYTrUpjS51cNFva2GBbC4vhsKaRD6ZLSy4cLRC6Z2a7StxVPKSBVaBmbx/M0cFcqMsf7HEu3VOMfVHCFTtWh+0gf/PeeLW/P9lngmyvpUpTXnRI39EI3pJPSdyLOCYm/w6qLWqOnK0Qd5PyT1CmGiPooBwFG7ikuRAoA/RBJkIIBNTQJAxDc2Xf8eYSnnRM4jDBxQD8owq8V3ssRmHHf6qVTxLXDw+m8dUA469h5oAIxbREUASk7I2gcPXpVx/tPa48S3R482lw81HSXCboD1Dg8QC0EGQQCDxBuCqvtht3+mpZaf+tUs38o3vPTdzWc+zztKz/DmF5l9GaOUauy/wCmP0lvvTrsCazzWqnxu9Gjc0cgna2x17WKdswGS5pJ1JOpJuSSnMPsGnhq5quaKjWXa0mPEW2kXBibW3rZuwDQCNfJVlTD5i5tRri/VtxlaLuJN4IAPNRWku1HsnZIb34q5Q6vTedbAuc5rm20cBAvbVHg3uYylTqOblBkmCDBlp13TfRXeFbmzd8RLMzZBm0kZ5+8Ia0QOMqPTx7Ax78zS7IWuzQRBNhH7fskaXW2bIDd2p/ZR/8ACXseKtI5XC4I+tFcbBqd5QpuJzHKATxIAv8ABW7aQhVpn9WOLdvy44prniC5gJHMEzHJURGi1n2oNjFUv7D7nfyso1Nll6OdUNySNErgEJKJmAeSIpM3Smu4oBRSHhKOibcYPVAEginkggDSxqiGvojYboBDmz6IqVMN0CcIix8kXJAAIFFyR8kASJGiBQGr+zGuBinUXf7jSW/3Mv6lpP6V19lG2i8+bOxhoVqVYa03tf1APiHm2R5r0bhnhzQ5tw4Ag8QRIKF41UY9rmtJaL2i03J4KgrPkAteRUvIHhaxt2ta0xvkAAHetNt6vkYLTLo1I+646i40CzGJmxa8OLwXvAHsaHxAaEEnpCmtsfEcU+8bAAZDQwReTBMuMDLN7lV+KL65OJOWaOXwj7wacxk/d3xxNtVLNIuBFPN7MGTEneAN5toOFk1iqLX+KlThjQ3vG6Z8pzEAD2rCeglJSb2LxBFR7C2BXzVqYmQMphzesEFbJnBcyoYoUcQ2u3M2mHf5TToQS0VmwNJBJG6RyXTXG9t6qMsvXKftZZFegeLag97P3WMmy3f2uM8WHP8A+g/9FhHDcmzvozu+tUl0zISgboDRCSabpSikvaN2qUN0oAn2ISXFG43KSgClBDKUEAtmqRUdYlBBAKYZEo5tKCCAM6SgUEEAHIkEEAVQWXcPsyxrquz6JdqzNT6im4tb7gB5IIIOLbaz7tHJ53fdEkXG8AjzWTp4qM0CLiIJsRceXIokFObow8JqudTaCCPE3NpoeI58+aLadA0AGse6KjRmmJuYMWtY+88UEEfqv6q9s4QsqOotectId82QCZAByk8Jc71K2vZ/FGph6LzYljT8kEE56jLxjftdb4aB/O7/ANf4XPAggqY30W7qjJ0QQSSDtUYN0SCARunmiIRoIApRoIID/9k="
                alt="captain"
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>

                <h4 className="text-lg font-semibold capitalize">{captain?.fullName?.firstName + " " + captain?.fullName?.lastName}</h4>
                <p className="text-sm text-gray-500">Audi</p>
              </div>
            </div>

            <div className="text-right">
              <h4 className="text-xl font-bold">₹295.20</h4>
              <p className="text-sm text-gray-500">Earned</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gray-200 my-4"></div>

          {/* Status */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              You are online and ready to accept rides
            </p>
          </div>

        </div>
        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <i className="ri-timer-fill text-2xl mb-1"></i>
            <h5 className="text-lg font-semibold">20 min</h5>
            <p className="text-sm text-gray-500">Hours Online</p>
          </div>

          <div className="flex flex-col items-center">
            <i className="ri-dashboard-2-fill text-2xl mb-1"></i>
            <h5 className="text-lg font-semibold">10.2</h5>
            <p className="text-sm text-gray-500">Trips</p>
          </div>

          <div className="flex flex-col items-center">
            <i className="ri-sticky-note-add-fill text-2xl mb-1"></i>
            <h5 className="text-lg font-semibold">₹295</h5>
            <p className="text-sm text-gray-500">Earnings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
