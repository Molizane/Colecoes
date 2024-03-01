import { useEffect, useState } from "react";
import servico from "../../services/TipoContaService";
import styles from "./styles.module.scss"
import Card from "../../components/Card";

export default function TipoConta() {
    const [tipos, setTipos] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const getAll = async () => {
        const response = await servico.getAll();
        setTipos(response.data);
    };

    useEffect(() => {
        console.log('page_load');

        /**
         * Título da aba
         */
        // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Tipos de Contas`;
        document.title = 'Tipos de Contas';
    }, []);

    useEffect(() => {
        console.log('refresh');
        getAll();
    }, [refresh]);

    const handleEdit = async function (id) {
    }

    const handleDelete = async function (id) {
        const response = await servico.remove(id);
        setRefresh(!refresh);
    }

    return (
        <div className='row m-0'>
            <div className='col-12'>
                <div className={styles.titulo}>
                    <h2>Tipos de Contas</h2>
                </div>
                <hr />
            </div>
            {
                tipos.map(tipo => (
                    <div key={`tipo${tipo.id}`} className='col-3'>
                        <Card
                            id={tipo.id}
                            qtde={tipo.qtde}
                            descricao={tipo.descricao}
                            color='white'
                            bgColor='#3f3f3f'
                            delColor='red'
                            editColor='yellow'
                            onEdit={handleEdit}
                            onDelete={handleDelete} />
                    </div>
                ))
            }
        </div>
    )
}
