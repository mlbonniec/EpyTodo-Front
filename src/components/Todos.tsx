import { Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import type { FC } from 'react';
import type { ITodo } from '../types/api';
import styles from '../styles/components/Todos.module.scss';

interface IProps {
  name: string;
  todos: ITodo[];
}

const Todos: FC<IProps> = ({ name, todos }) => {
  return (
    <div className={styles.todos}>
      <Heading className={styles['table-title']}>{name}</Heading>
      <TableContainer>
        <Table size="lg" variant="striped">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Owner</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todos && todos.map(e => (
              <Tr key={e.id}>
                <Td>{e.id}</Td>
                <Td className={styles.title}>{e.title}</Td>
                <Td className={styles.description}>{e.description}</Td>
                <Td className={styles.status}>{e.status}</Td>
                <Td className={styles.owner}>{e.user_id}</Td>
                <Td className={styles.edit}>
                  <Link href={`/todos/${e.id}`}>
                    <a>
                      <EditIcon />
                    </a>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Todos;
