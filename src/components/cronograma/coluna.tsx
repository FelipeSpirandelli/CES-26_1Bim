"use client";
import React from 'react';
import { useSession } from "next-auth/react";
// import json exercicios
import exerciciosData from '~/data/execicios.json'

import { api } from "~/utils/api";
import { doc } from 'prettier';

type props = {
    name: string,
    lines: number,
    tipo: number,

}


const ColComponent: React.FC<props> = ({ name, lines, tipo }) => {

    // Pegar id do usuario
    const { data: session } = useSession()
    const id_usuario = session?.user?.id as string
    
    // Carregar os exercicios do banco de dados
    const exerciciosDB = api.exercicios.getExercicosMaisRecentesPorTreino.useQuery({ treino: tipo, id_usuario: id_usuario})

    let id_exercicios = undefined as number[] | undefined
    let pesos = undefined as number[] | undefined
    let data = undefined
    let dataI = undefined
       
    if(exerciciosDB.data && exerciciosDB.data.length > 0){

        // Data do ultimo treino
        if (exerciciosDB.data[0]){
            data = exerciciosDB.data[0].data

            id_exercicios = []
            pesos = []

            // Pegar os exercicios do ultimo treino
            for (let i = 0; i < exerciciosDB.data.length; i++) {
                if(exerciciosDB.data[i]){
                    dataI = exerciciosDB.data[i]
                    if(dataI?.data.getDay() == data?.getDay()){
                        id_exercicios.push(dataI.id_exercicio)
                        pesos.push(dataI.peso)
                    }
                }
            }
            console.log(id_exercicios)
        }
    }

    // Função para salvar os dados do formulario ao clicar no botão salvar
    const saveData = () => {
        // Pegar os dados do formulario
        const data_form = document.getElementById("col"+tipo+"Data") as HTMLInputElement

        console.log(data_form.value)

        // Impedir que recarregue a pagina
    }

    // Funcao onchange para mudar o valor do input de exercicios
    const changeExercicio = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // mudar o valor do input de exercicios
        const exercicio = event.target.value
        document.getElementById(event.target.id)?.setAttribute('value', exercicio)
        console.log(event.target.value)
    }

    return (
        // Coluna de largura 1/4 do container e altura do que sobrar da tela com itens alinhados ao centro
        <div className="w-1/4 h-full flex flex-col items-center justify-center gap-4">
            {/* Nome da coluna cor 264653 */}
            <p className="text-3xl text-azul_escuro font-medium py-1">{name}</p>
            {/* Começar formulario */}
            <form className="flex flex-col items-center justify-center gap-4 px-5">
                {Array.from(Array(lines).keys()).map((line) => {
                    return (
                        <div className="flex flex-row items-center justify-center gap-4">
                            {/* Numero da linha */}
                            <p className="text-azul_escuro font-medium"> E {line + 1}</p>
                            {/* Input de exercicio */}
                            <select className="w-1/2 h-10 rounded-full px-4" id={"col"+tipo+"line"+line+"Exer"} name={"col"+tipo+"line"+line+"Exer"} value={id_exercicios ? id_exercicios[line] : 0} onChange={changeExercicio}>
                                {/* Padrão */}
                                <option value={0} key={0}>Sem Exercicio</option>
                                {/* Mapear exercicios */}
                                {exercicios.map((exercicio) => (
                                <option key={exercicio.id} value={exercicio.id}>
                                    {exercicio.nome}
                                </option>
                                ))}
                            </select>
                            {/* Input de Peso */}
                            <input className="w-1/4 h-10 rounded-full px-4" type="number" placeholder="Kg" id={"col"+tipo+"line"+line+"Peso"} name={"col"+tipo+"line"+line+"Peso"} defaultValue={pesos ? pesos[line] : 0}/>
                            {/* Input de Repetições */}
                        </div>
                    )
                })}
                <div className="flex flex-row items-center justify-center gap-4 w-full">
                    {/* Input de Data */}
                    <input className="w-1/2 h-10 rounded-full px-4" type="date" placeholder="Data" id={"col"+tipo+"Data"} name={"col"+tipo+"Data"} defaultValue={
                                                                                                                                                    data
                                                                                                                                                    ? `${data.getFullYear()}-${
                                                                                                                                                        (data.getMonth() + 1).toString().padStart(2, '0')
                                                                                                                                                        }-${data.getDate().toString().padStart(2, '0')}`
                                                                                                                                                    : ''}/>
                    {/* Botão Salvar */}
                    <button className="w-1/2 h-10 rounded-full px-4 bg-azul_escuro text-white font-medium" type="button" onClick={saveData}>Salvar</button>
                </div>
            </form>
        </div>
    );
};

// Carregar os dados dos exercicios
const exercicios = exerciciosData.exercicios

export default ColComponent;