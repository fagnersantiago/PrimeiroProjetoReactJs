import React, { useState, useEffect, FormEvent } from 'react';
import logoImg from '../../assets/Logo.svg'
import { FiChevronRight } from 'react-icons/fi';
import {Link} from 'react-router-dom';
import api from '../../services/api'

import { Title, Form, Repositories, Error } from './style';

interface Repository {

    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}


const Dashboard: React.FC = () => {

    const [newRepo, setNewRepo] = useState('');

    const [inputError, setInpuError] = useState('');

    const [repositories, setRepositories] = useState<Repository[]>(()=>{
        
        
        const storegedRepositories = localStorage.getItem(

        '@GithubExplorer: repositories',

        ); 

         if(storegedRepositories) {
             
            return JSON.parse(storegedRepositories);
         }

         return [];
    });

    useEffect(()=>{

        localStorage.setItem('@GithubExplorer: repositories', JSON.stringify(repositories));
    },[repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {

        event.preventDefault();

        if (!newRepo) {

            setInpuError('Digite um autor/nome do reposiório');

            return;
        }


        try {

            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInpuError('');


        } catch (err) {

            setInpuError('Erro na busca por esse repositório');
        }
    }

    return (

        <>
            <img src={logoImg} alt="Git Hub Explorer" />
            <Title>Explore repositorio do Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Digite o nome do reposiório aqui"
                />
                <button type="submit">Pesquisar</button>
            </Form>
            {inputError && <Error>{inputError}</Error>}
            <Repositories>
                {repositories.map(repostory => (

                    <Link key={repostory.full_name} to={`/repository/${repostory.full_name}`}>

                        <img src={repostory.owner.avatar_url}
                            alt={repostory.owner.login} />
                        <div>
                            <strong>{repostory.full_name}</strong>
                            <p>{repostory.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>))}
            </Repositories>
        </>

    )
}

export default Dashboard;