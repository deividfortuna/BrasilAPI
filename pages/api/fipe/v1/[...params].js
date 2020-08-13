import fipe from 'fipe-promise';
import microCors from 'micro-cors';

const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

// /api/fipe/v1/[tipo-veiculo]/[marca]/[model]/[ano-referencia]

// retorna marcas to tipo de veiculo: /api/fipe/v1/carros
// retorna modelos da marca: /api/fipe/v1/carros/21
// retorna anos do modelo: /api/fipe/v1/carros/21/4828
// retorna informacoes do veiculos: /api/fipe/v1/carros/21/4828/2013-1

async function FipeHandler(request, response) {
  const {
    query: { params },
  } = request

  const [type, brand, model, year] = params;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    if (type && brand && model && year) {
      return response.status(200)
        .json(await fipe.fetchDetail(type, brand, model, year));
    } else if (type && brand && model) {
      return response.status(200)
        .json(await fipe.fetchYears(type, brand, model));
    } else if (type && brand) {
      return response.status(200)
        .json(await fipe.fetchModels(type, brand));
    } else if (type) {
      return response.status(200)
        .json(await fipe.fetchBrands(type));
    }
  } catch (error) {

    return response.status(500).json(error);
  }
}

export default cors(FipeHandler);
