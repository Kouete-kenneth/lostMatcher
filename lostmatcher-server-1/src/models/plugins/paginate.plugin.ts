import { Schema, Document, Model, Types } from 'mongoose';

/**
 * Pagination options interface
 */
interface PaginateOptions {
    sortBy?: string;
    populate?: string;
    limit?: number;
    page?: number;
}

/**
 * Query result interface
 */
interface QueryResult<T> {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

/**
 * Pagination plugin for Mongoose schemas
 * @param {Schema} schema - Mongoose schema to add pagination functionality to
 */
const paginate = <T extends Document>(schema: Schema<T>) => {
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {PaginateOptions} [options] - Query options
     * @returns {Promise<QueryResult<T>>}
     */
    schema.statics.paginate = async function (filter: Record<string, any> = {}, options: PaginateOptions = {}): Promise<QueryResult<T>> {
        let sort = '';
        if (options.sortBy) {
            const sortingCriteria = options.sortBy.split(',').map((sortOption) => {
                const [key, order] = sortOption.split(':');
                return (order === 'desc' ? '-' : '') + key;
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = 'createdAt';
        }

        const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? options.limit : 10;
        const page = options.page && parseInt(options.page.toString(), 10) > 0 ? options.page : 1;
        const skip = (page - 1) * limit;

        const countPromise = this.countDocuments(filter).exec();
        let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

        // Handle populate correctly
        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
                docsPromise = docsPromise.populate(populateOption);
            });
        }

        docsPromise = docsPromise.exec();

        const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
        const totalPages = Math.ceil(totalResults / limit);
        return {
            results,
            page,
            limit,
            totalPages,
            totalResults
        };
    };
};

export default paginate;
