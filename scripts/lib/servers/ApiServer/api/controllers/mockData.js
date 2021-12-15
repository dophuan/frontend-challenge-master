const _ = require("lodash");
const Storage = require("../Storage");

const store = new Storage("mockData");

const getAll = (req, res) => {
  const {
    page: pageParam,
    limit: pageSizeParam,
    search: searchParam,
    sortBy: sortByParam,
    sortType: sortTypeParam,
  } = req.swagger.params;
  const { value: page } = pageParam;
  const { value: limit } = pageSizeParam;
  let { value: search } = searchParam;
  const { value: sortType } = sortTypeParam;
  const { value: sortBy } = sortByParam;

  const start = (page - 1) * limit;
  search = (search && search.trim()) || "";
  const searches = search.toLowerCase().split(/\s+/);
  const list = store.list().filter((item) => {
    if (!searches.length) {
      return true;
    }

    let include = false;
    const text = [item.name, item.original_type].join(" ").toLowerCase();
    searches.forEach((search) => {
      include = include || text.includes(search);
    });

    return include;
  });

  const sortedList = list.sort((first, second) => {
    if (_.isEmpty(sortBy) || _.isEmpty(sortType)) {
      return true;
    }
    const a = first[sortBy];
    const b = second[sortBy];
    if (sortType === "desc") {
      return a > b ? -1 : 1;
    }
    return a > b ? 1 : -1;
  });
  const data = sortedList.slice(start, start + limit);

  res.json({
    displayItems: data.length,
    currentPage: page,
    totalPages: Math.ceil(list.length / limit),
    data,
  });
};

const get = (req, res) => {
  const { id: idParam } = req.swagger.params;
  const id = idParam.value.toString();

  if (!store.has(id)) {
    return res.status(404).json({
      message: `${id} not found`,
    });
  }

  res.json(store.get(id));
};

const del = (req, res) => {
  const { id: idParam } = req.swagger.params;
  const id = idParam.value.toString();

  if (!store.has(id)) {
    return res.status(404).json({
      message: `${id} not found`,
    });
  }

  const deleted = store.get(id);
  store.del(id);

  res.json(deleted);
};

const update = (req, res) => {
  const { id: idParam } = req.swagger.params;
  const id = idParam.value.toString();

  const { body: bodyParam } = req.swagger.params;
  const { value } = bodyParam;

  if (!store.has(id)) {
    return res.status(404).json({
      message: `${id} not found`,
    });
  }

  res.json(store.update(id, value));
};

const add = async (req, res) => {
  const { body: bodyParam } = req.swagger.params;
  const { value } = bodyParam;
  res.status(201).json(store.add(value));
};

module.exports = {
  add,
  delete: del,
  get,
  getAll,
  update,
};
