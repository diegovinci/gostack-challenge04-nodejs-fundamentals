import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  private checkSufficientFunds(outcome: number): boolean {
    const { total } = this.transactionsRepository.getBalance();

    if (outcome > total) {
      return false;
    }

    return true;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw Error('Invalid transaction type');
    }

    if (typeof value !== 'number') {
      throw Error('Transaction value should be a number');
    }

    if (type === 'outcome') {
      if (!this.checkSufficientFunds(value)) {
        throw Error('Insufficient funds');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
