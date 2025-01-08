import { HttpStatus, Injectable } from "@nestjs/common";
import { ResponseData } from "../utils/enum";
import { HandleResponse } from "../helper/exception-filter/helperResponse";


@Injectable()
export class DbService {
    async findOne(
        collection: any,
        condition?: any,
        selectAttribute?: any[],
        errorMessage?: { message: string },
        include?: any[],
        order?: any[],
        isSoftDelete?: boolean,
        skip?: number,
        pageSize?: number,
        group?: any[],
      ) {
        console.log('isSoftDelete', isSoftDelete)
        if (isSoftDelete) {
          condition = {...condition, is_deleted : false};
        }
        console.log('condition', condition)
        const result = await collection.findOne({
          attributes: selectAttribute,
          where: condition,
          include,
          order,
          offset: skip || 0,
          limit: pageSize,
          group: group,
        });
    
        if (errorMessage && !result) {
          throw HandleResponse(
            HttpStatus.NOT_FOUND,
            ResponseData.ERROR,
            errorMessage.message,
          );
        }
    
        return result;
      }

    async create(
        collection: any,
        insertData: any,
        transaction?: any,
        uniqueCheck?: { uniqueField: string; message: string },
    ) {
        console.log('insertData', insertData)
        console.log('insertData', uniqueCheck)

        if (uniqueCheck) {
            console.log('inside if')
            const uniqueField = uniqueCheck?.uniqueField;
            const response = await this.findOne(collection, {
                [uniqueField]: insertData[uniqueField],
            });
            console.log('response', response)
            if (response) {
                await transaction?.rollback();
                throw HandleResponse(
                    HttpStatus.BAD_REQUEST,
                    ResponseData.ERROR,
                    uniqueCheck.message,
                );
            }
        }
        return collection.create(insertData, { transaction });
    }

    async findAll(
        collection: any,
        selectAttribute?: any,
        condition?: any,
        order?: any[],
        include?: any[],
        errorMessage?: { message: string },
        isSoftDelete?: boolean,
        skip?: number,
        pageSize?: number,
        group?: any[],
        subQuery?: boolean,
      ) {
        if (isSoftDelete) {
          condition.is_deleted = false;
        }
    
        const result = await collection.findAll({
          attributes: selectAttribute,
          where: condition,
          order,
          include,
          errorMessage,
          offset: skip || 0,
          limit: pageSize,
          group: group,
          subQuery: subQuery,
        });
    
        if (errorMessage && result.length === 0) {
          throw HandleResponse(
            HttpStatus.NOT_FOUND,
            ResponseData.ERROR,
            errorMessage.message,
          );
        }
        return result;
    }

    async destroy(
      collection: any,
      condition: any,
      errorMessage?: { message: string },
      transaction?: any,
    ) {
      const result = await collection.destroy({
        where: condition,
        transaction,
      });
  
      if (errorMessage && result[0] === 0) {
        throw HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          errorMessage.message,
        );
      }
  
      return result;
    }

    async update(
      collection: any,
      selection: any,
      condition: any,
      transaction?: any,
      errorMessage?: { message: string },
      isSoftDelete?: boolean,
    ) {
      if (isSoftDelete) {
        condition.is_deleted = false;
      }
  
      const result = await collection.update(
        selection,
        {
          where: condition,
        },
        { transaction },
      );
  
      if (errorMessage && result[0] === 0) {
        await transaction?.rollback();
        throw HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          errorMessage.message,
        );
      }
  
      return result;
    }
}
